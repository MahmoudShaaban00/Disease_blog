// commentSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Get comments
export const getComment = createAsyncThunk(
  "commentSlice/getComment",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://cancapp.runasp.net/api/Comments/${postId}`);
      console.log("Fetched comments:", response.data.value);
      return { postId, comments: response.data.value };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch comments");
    }
  }
);

// Create comment
export const createComment = createAsyncThunk(
  "commentSlice/createComment",
  async (
    { postId, userId, content }: { postId: string; userId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const body = { PostId: postId, UserId: userId, Content: content };
      const response = await axios.post(`https://cancapp.runasp.net/api/Comments`, body);
      return { postId, newComment: response.data.value };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to create comment");
    }
  }
);

// Delete comment
export const deleteComment = createAsyncThunk(
  "commentSlice/deleteComment",
  async (
    { postId, commentId }: { postId: string; commentId: string },
    { rejectWithValue }
  ) => {
    try {
      await axios.delete(`https://cancapp.runasp.net/api/Comments/${postId}/${commentId}`);
      return { postId, commentId };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to delete comment");
    }
  }
);

// Edit comment
export const editComment = createAsyncThunk(
  "commentSlice/editComment",
  async (
    { postId, commentId, content }: { postId: string; commentId: number; content: string },
    { rejectWithValue }
  ) => {
    try {
      const body = { postId: Number(postId), commentId, content };
      const response = await axios.put("https://cancapp.runasp.net/api/Comments", body);
      return { postId, commentId, updatedComment: response.data.value };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to edit comment");
    }
  }
);

// State
interface CommentState {
  comments: Record<string, any[]>;
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: {},
  loading: false,
  error: null,
};

export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComment.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        state.loading = false;
        state.comments[postId] = comments;
      })
      .addCase(getComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        const { postId, newComment } = action.payload;
        state.loading = false;
        if (!state.comments[postId]) state.comments[postId] = [];
        state.comments[postId].push(newComment);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;
        state.comments[postId] = state.comments[postId].filter((c) => c.id !== commentId);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(editComment.fulfilled, (state, action) => {
        const { postId, commentId, updatedComment } = action.payload;
        const index = state.comments[postId]?.findIndex((c) => c.id === commentId);
        if (index !== -1) {
          state.comments[postId][index] = updatedComment;
        }
      })
      .addCase(editComment.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const commentReducer = commentSlice.reducer;
