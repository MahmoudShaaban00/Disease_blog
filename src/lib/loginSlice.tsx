// src/lib/loginSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define User interface
export interface User {
  id: string;
  email: string;
  userType: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface LoginState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: LoginState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Helper to extract error message
function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Login failed';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// loginUser thunk
export const loginUser = createAsyncThunk<
  { token: string; user: User },
  { email: string; password: string },
  { rejectValue: string }
>(
  'login/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post(
        'https://cancapp.runasp.net/api/auth/login',
        credentials,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { token, ...user } = response.data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userType', user.userType);
      }

      return { token, user };
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userType');
      }
    },
    setUserFromStorage(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });
  },
});

export const { logout, setUserFromStorage } = loginSlice.actions;
export const loginReducer = loginSlice.reducer;
