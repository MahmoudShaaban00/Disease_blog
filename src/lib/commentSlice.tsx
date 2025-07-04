import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ------------------ Types ------------------

export interface Comment {
  id: number;
  postId: string;
  userId: string;
  content: string;
  [key: string]: string | number | undefined;
}

export interface CommentState {
  comments: Record<string, Comment[]>;
  loading: boolean;
  error: string | null;
}

// ------------------ Helper ------------------

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "Axios error";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// ------------------ Thunks ------------------

// Get comments
export const getComment = createAsyncThunk<
  { postId: string; comments: Comment[] },
  string,
  { rejectValue: string }
>("commentSlice/getComment", async (postId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`https://cancapp.runasp.net/api/Comments/${postId}`);
    return { postId, comments: response.data.value };
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// Create comment
export const createComment = createAsyncThunk<
  { postId: string; newComment: Comment },
  { postId: string; userId: string; content: string },
  { rejectValue: string }
>("commentSlice/createComment", async ({ postId, userId, content }, { rejectWithValue }) => {
  try {
    const body = { PostId: postId, UserId: userId, Content: content };
    const response = await axios.post(`https://cancapp.runasp.net/api/Comments`, body);
    return { postId, newComment: response.data.value };
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// Delete comment
export const deleteComment = createAsyncThunk<
  { postId: string; commentId: number },
  { postId: string; commentId: number },
  { rejectValue: string }
>("commentSlice/deleteComment", async ({ postId, commentId }, { rejectWithValue }) => {
  try {
    await axios.delete(`https://cancapp.runasp.net/api/Comments/${postId}/${commentId}`);
    return { postId, commentId };
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// Edit comment
export const editComment = createAsyncThunk<
  { postId: string; commentId: number; updatedComment: Comment },
  { postId: string; commentId: number; content: string },
  { rejectValue: string }
>("commentSlice/editComment", async ({ postId, commentId, content }, { rejectWithValue }) => {
  try {
    const body = { postId: Number(postId), commentId, content };
    const response = await axios.put("https://cancapp.runasp.net/api/Comments", body);
    return { postId, commentId, updatedComment: response.data.value };
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// ------------------ Slice ------------------

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
      // Get Comments
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
        state.error = action.payload || "Failed to fetch comments";
      })

      // Create Comment
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
        state.error = action.payload || "Failed to create comment";
      })

      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;
        state.comments[postId] = state.comments[postId]?.filter((c) => c.id !== commentId);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete comment";
      })

      // Edit Comment
      .addCase(editComment.fulfilled, (state, action) => {
        const { postId, commentId, updatedComment } = action.payload;
        const index = state.comments[postId]?.findIndex((c) => c.id === commentId);
        if (index !== undefined && index !== -1) {
          state.comments[postId][index] = updatedComment;
        }
      })
      .addCase(editComment.rejected, (state, action) => {
        state.error = action.payload || "Failed to edit comment";
      });
  },
});

export const commentReducer = commentSlice.reducer;
