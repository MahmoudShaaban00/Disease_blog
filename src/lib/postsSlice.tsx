// src/lib/postsSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define Post interface according to your API structure
export interface Post {
  id: string;
  content: string;
  image?: string;
  userId: string;
  // add other fields your post has
}

interface FetchError {
  message: string;
}

// GET all posts
export const getAllPosts = createAsyncThunk<Post[]>(
  "posts/getAll",
  async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
    const response = await fetch("https://cancapp.runasp.net/api/post?PageNumber=1&PageSize=10", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token,
      },
    });
    const data = await response.json();
    return data.value.data as Post[];
  }
);

// CREATE post
export const createPost = createAsyncThunk<Post, FormData, { rejectValue: string }>(
  "posts/create",
  async (formdata, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
      const response = await fetch("https://cancapp.runasp.net/api/post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formdata,
      });

      if (!response.ok) {
        const errorData: FetchError | null = await response.json().catch(() => null);
        return rejectWithValue(errorData?.message || `Failed to create post, status ${response.status}`);
      }

      const data: Post = await response.json();
      return data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Network error";
      return rejectWithValue(message);
    }
  }
);

// DELETE post
export const deletePost = createAsyncThunk<string, string, { rejectValue: string }>(
  "posts/delete",
  async (postId, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
      const response = await fetch(`https://cancapp.runasp.net/api/post/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData: FetchError | null = await response.json().catch(() => null);
        return rejectWithValue(errorData?.message || "Failed to delete post");
      }

      return postId;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Network error";
      return rejectWithValue(message);
    }
  }
);

// UPDATE post
export const updatePost = createAsyncThunk<
  Post,
  { postId: string; formdata: FormData },
  { rejectValue: string }
>(
  "posts/update",
  async ({ postId, formdata }, { rejectWithValue }) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

      const response = await fetch(`https://cancapp.runasp.net/api/post/${postId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formdata,
      });

      if (!response.ok) {
        let errorMessage = `Failed to update post with status ${response.status}`;
        try {
          const errorText = await response.text();
          if (errorText) {
            const errorData = JSON.parse(errorText);
            if (errorData?.message) {
              errorMessage = errorData.message;
            }
          }
        } catch {
          // parsing failed or no body
        }
        return rejectWithValue(errorMessage);
      }

      const text = await response.text();
      let data: Post | null = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          // Invalid JSON, ignore
        }
      }

      const updatedPost: Post = data || {
        id: formdata.get("Id") as string,
        content: formdata.get("Content") as string,
        userId: formdata.get("UserId") as string,
        image: "", // optionally set image if you have it
      };

      return updatedPost;
    } catch (error: unknown) {
      console.error("Update Post Error:", error);
      const message = error instanceof Error ? error.message : "Unexpected error";
      return rejectWithValue(message);
    }
  }
);




// State interface
export interface PostsState {
  allPosts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  allPosts: [],
  loading: false,
  error: null,
};

// SLICE
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get posts
    builder.addCase(getAllPosts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
      state.loading = false;
      state.allPosts = action.payload;
    });
    builder.addCase(getAllPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch posts";
    });

    // Create post
    builder.addCase(createPost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
      state.loading = false;
      state.allPosts.unshift(action.payload);
    });
    builder.addCase(createPost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message || "Failed to create post";
    });

    // Delete post
    builder.addCase(deletePost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deletePost.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.allPosts = state.allPosts.filter((post) => post.id !== action.payload);
    });
    builder.addCase(deletePost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message || "Failed to delete post";
    });

    // Update post
    builder.addCase(updatePost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
      state.loading = false;
      const index = state.allPosts.findIndex((post) => post.id === action.payload.id);
      if (index !== -1) {
        state.allPosts[index] = action.payload;
      }
    });
    builder.addCase(updatePost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message || "Failed to update post";
    });
  },
});

export const postsReducer = postsSlice.reducer;
export const postsActions = postsSlice.actions;
