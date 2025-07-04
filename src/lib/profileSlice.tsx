import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ------------------ Types ------------------

export interface User {
  id: string;
  name: string;
  address: string;
  image: string;
  userType: string;
}

export interface TokenResponse {
  message: string;
}

export interface PasswordChangeResponse {
  message: string;
}

export interface ProfileState {
  users: User[];
  loading: boolean;
  error: string | null;
  message: string;
}

// ------------------ Initial State ------------------

const initialState: ProfileState = {
  users: [],
  loading: false,
  error: null,
  message: "",
};

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

// Add token
export const addToken = createAsyncThunk<
  TokenResponse,
  void,
  { rejectValue: string }
>("profile/addToken", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      return rejectWithValue("Missing token or userId");
    }

    const response = await axios.post(
      "https://cancapp.runasp.net/api/User/save-token",
      { token, userId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data as TokenResponse;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// Get Users
export const getUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("profile/getUsers", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType") || "Patient";

    if (!token) {
      return rejectWithValue("Missing token");
    }

    const response = await axios.get(
      "https://cancapp.runasp.net/api/User/GetUsers",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: { userType },
      }
    );

    return response.data as User[];
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// Update profile
export const updateProfile = createAsyncThunk<
  User,
  FormData,
  { rejectValue: string }
>("profile/updateProfile", async (formData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("Missing token");
    }

    const response = await axios.put(
      "https://cancapp.runasp.net/api/User/EditUserProfile",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data as User;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// Change password
export const changePassword = createAsyncThunk<
  PasswordChangeResponse,
  { oldPassword: string; newPassword: string },
  { rejectValue: string }
>("profile/changePassword", async ({ oldPassword, newPassword }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("Missing token");
    }

    const response = await axios.post(
      "https://cancapp.runasp.net/api/User/ChangePassword",
      { oldPassword, newPassword },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data as PasswordChangeResponse;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// ------------------ Slice ------------------

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // addToken
    builder.addCase(addToken.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = "";
    });
    builder.addCase(addToken.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message || "Token saved successfully";
    });
    builder.addCase(addToken.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Token save failed";
    });

    // getUsers
    builder.addCase(getUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(getUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch users";
    });

    // updateProfile
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = "";
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.message = "Profile updated successfully";

      const updatedUser = action.payload;
      const index = state.users.findIndex((u) => u.id === updatedUser.id);
      if (index !== -1) {
        state.users[index] = updatedUser;
      } else {
        state.users.push(updatedUser);
      }
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Profile update failed";
    });

    // changePassword
    builder.addCase(changePassword.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = "";
    });
    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message || "Password changed successfully";
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Password change failed";
    });
  },
});

export const profileReducer = profileSlice.reducer;
