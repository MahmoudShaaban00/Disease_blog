// src/lib/loginSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'login/loginUser',
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post(
        'https://cancapp.runasp.net/api/auth/login',
        credentials,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Response data:', response.data);

      // Adjust destructuring according to API response shape
      // Assuming response.data includes token and user fields on the root level
      const { token, ...user } = response.data;

      // Save token and user id to localStorage (browser only)
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userType', user.userType);
      }

      return { token, user };
    } catch (error: any) {
      console.error('Login error:', error.response);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

interface LoginState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: LoginState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

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
      }
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
        state.error = null;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = loginSlice.actions;
export const loginReducer = loginSlice.reducer;
