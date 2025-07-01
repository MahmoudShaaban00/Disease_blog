// src/lib/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define Auth State interface
interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
  emailConfirmed: boolean;
  emailResent: boolean;
}

// Initial state with proper typing
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  emailConfirmed: false,
  emailResent: false,
};

// Register User
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData: FormData, thunkAPI) => {
    try {
      const res = await axios.post(
        "https://cancapp.runasp.net/api/auth/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Registration successful:", res.data);
      return res.data;
    } catch (error: any) {
      console.error("Registration error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Confirm Email
export const confirmEmail = createAsyncThunk(
  "auth/confirmEmail",
  async (data: { email: string; otp: string }, thunkAPI) => {
    try {
      const res = await axios.post(
        "https://cancapp.runasp.net/api/auth/confirm-email",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Email confirmed:", res.data);
      return res.data;
    } catch (error: any) {
      console.error("Email confirmation error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Email confirmation failed"
      );
    }
  }
);

// Resend Email Confirmation
export const resendConfirmEmail = createAsyncThunk(
  "auth/resendConfirmEmail",
  async (data: { email: string }, thunkAPI) => {
    try {
      const res = await axios.post(
        "https://cancapp.runasp.net/api/auth/resend-Confirm-email",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Resend confirmation email success:", res.data);
      return res.data;
    } catch (error: any) {
      console.error("Resend email error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Resend email failed"
      );
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Confirm Email
      .addCase(confirmEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.emailConfirmed = false;
      })
      .addCase(confirmEmail.fulfilled, (state) => {
        state.loading = false;
        state.emailConfirmed = true;
      })
      .addCase(confirmEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.emailConfirmed = false;
      })

      // Resend Confirm Email
      .addCase(resendConfirmEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.emailResent = false;
      })
      .addCase(resendConfirmEmail.fulfilled, (state) => {
        state.loading = false;
        state.emailResent = true;
      })
      .addCase(resendConfirmEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.emailResent = false;
      });
  },
});

export const authReducer = authSlice.reducer;
