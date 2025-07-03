import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// GET all posts
export const getAllPosts = createAsyncThunk('getAllPosts/postsSlice', async () => {
  const response = await fetch('https://cancapp.runasp.net/api/post?PageNumber=1&PageSize=10', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      token: localStorage.getItem('token') || '',
    },
  });

  const data = await response.json();
  console.log('Fetched posts:', data);

  // Return only the array of posts
  return data.value.data;
});

// CREATE post
export const createPost = createAsyncThunk('createPost/postsSlice', async (formdata: FormData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token') || '';
    const response = await fetch('https://cancapp.runasp.net/api/post', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formdata,
    });

    if (!response.ok) {
      // Try to parse error JSON safely
      let errorData = null;
      try {
        errorData = await response.json();
      } catch {
        // Ignore JSON parse error
      }
      return rejectWithValue(errorData?.message || `Failed to create post, status ${response.status}`);
    }

    // Check if response has content before parsing JSON
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    console.log('Created post:', data);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Network error');
  }
});


// DELETE post
export const deletePost = createAsyncThunk('deletePost/postsSlice', async (postId: string) => {
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || '';
    console.log('Using token:', token);
  }

  const response = await fetch(`https://cancapp.runasp.net/api/post/${postId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete post');
  }

  console.log('Deleted post:', postId);
  alert('Post deleted successfully!');
  return postId;
});

// UPDATE post
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, formdata }: { postId: string; formdata: FormData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`https://cancapp.runasp.net/api/post`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formdata,
      });
      console.log('Update response:', res);
      alert('Post updated successfully!');

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        return rejectWithValue(error.message || "Failed to update post");
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Unexpected error");
    }
  }
);

// SLICE
const postsSlice = createSlice({
  name: 'postsSlice',
  initialState: {
    allPosts: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Get posts
    builder.addCase(getAllPosts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllPosts.fulfilled, (state, action) => {
      state.loading = false;
      state.allPosts = action.payload?.data || action.payload; // Adjust based on API shape
    });
    builder.addCase(getAllPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch posts';
    });

    // Create post
    builder.addCase(createPost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.allPosts.unshift(action.payload);
      }
    });
    builder.addCase(createPost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to create post';
    });

    // Delete post
    builder.addCase(deletePost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.loading = false;
      state.allPosts = state.allPosts.filter(post => post.id !== action.payload);
    });
    builder.addCase(deletePost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to delete post';
    });

    // Update post
    builder.addCase(updatePost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updatePost.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.allPosts.findIndex(post => post.id === action.payload.id);
      if (index !== -1) {
        state.allPosts[index] = action.payload;
      }
    });
    builder.addCase(updatePost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || action.error.message || 'Failed to update post';
    });
  },
});

export const postsReducer = postsSlice.reducer;
export const postsActions = postsSlice.actions;
