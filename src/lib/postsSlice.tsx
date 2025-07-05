// src/lib/postsSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

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

      const contentType = response.headers.get("Content-Type");

      if (!response.ok) {
        let errorMessage = `Failed to create post, status ${response.status}`;
        if (contentType?.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorMessage;
        }
        return rejectWithValue(errorMessage);
      }

      // Success - try to parse JSON only if content exists
      if (contentType?.includes("application/json")) {
        const data: Post = await response.json();
        return data;
      } else {
        // Optional: return a dummy post or message if server returns no content
        console.warn("No JSON returned from server.");
        return {
          id: "", // You can adjust according to your Post model
          content: "",
          image: "",
          userId: "",
        } as Post;
      }
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
  { formdata: FormData },
  { rejectValue: string }
>(
  "posts/update",
  async ({ formdata }, { rejectWithValue }) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

      const response = await axios.put<Post>(
        "https://cancapp.runasp.net/api/Post", // no postId in URL
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    }catch (error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : "Unexpected error";
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
