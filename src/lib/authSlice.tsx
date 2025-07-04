import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// ----------- Types -----------
interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
  [key: string]: unknown; 
}


export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  emailConfirmed: boolean;
  emailResent: boolean;
}

// ----------- Initial State -----------
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  emailConfirmed: false,
  emailResent: false,
};

// ----------- Error Helper -----------
function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "Unknown error";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// ----------- Thunks -----------

// Register
export const registerUser = createAsyncThunk<
  User,
  FormData,
  { rejectValue: string }
>("auth/registerUser", async (formData, thunkAPI) => {
  try {
    const res = await axios.post(
      "https://cancapp.runasp.net/api/auth/register",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// Confirm Email
export const confirmEmail = createAsyncThunk<
  { success: boolean; message: string },
  { email: string; otp: string },
  { rejectValue: string }
>("auth/confirmEmail", async (data, thunkAPI) => {
  try {
    const res = await axios.post(
      "https://cancapp.runasp.net/api/auth/confirm-email",
      data,
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// Resend Email
export const resendConfirmEmail = createAsyncThunk<
  { success: boolean; message: string },
  { email: string },
  { rejectValue: string }
>("auth/resendConfirmEmail", async (data, thunkAPI) => {
  try {
    const res = await axios.post(
      "https://cancapp.runasp.net/api/auth/resend-Confirm-email",
      data,
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// ----------- Slice -----------
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
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Registration failed";
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
        state.error = action.payload ?? "Email confirmation failed";
        state.emailConfirmed = false;
      })

      // Resend Email
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
        state.error = action.payload ?? "Resend email failed";
        state.emailResent = false;
      });
  },
});

export const authReducer = authSlice.reducer;
