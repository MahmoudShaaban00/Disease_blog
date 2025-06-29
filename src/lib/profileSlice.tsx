// src/lib/profileSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to send token and userId using axios
export const addToken = createAsyncThunk(
  "profile/addToken",
  async (_, { rejectWithValue }) => {
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

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        console.error("Error response data:", error.response.data);
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

// Async thunk to fetch users using axios
export const getUsers = createAsyncThunk(
  "profile/getUsers",
  async (_, { rejectWithValue }) => {
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
      console.log("Response data:", response.data);

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        console.error("Error response data:", error.response.data);
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Failed to fetch users");
    }
  }
);


export const changePassword = createAsyncThunk<
  any, // return type of fulfilled action (adjust if you know exact shape)
  { oldPassword: string; newPassword: string }, // argument type
  { rejectValue: string } // reject type
>(
  "profile/changePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Missing token");
      }

      const response = await axios.post(
        "https://cancapp.runasp.net/api/User/ChangePassword", // replace with your real endpoint
        { oldPassword, newPassword },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );


      console.log('change password sccessful' , response.data)
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        console.log('error' , error.response.data.error)
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("Failed to change password");
    }
  }
);

// Async thunk to update user profile using axios
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      console.log(token);
      if (!token) {
        return rejectWithValue("Missing token");
      }

      console.log(formData);
      const response = await axios.put(
        `https://cancapp.runasp.net/api/User/EditUserProfile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Update successful", response.data);
      return response.data; // Assume this is the updated user object
    } catch (error: any) {
      console.error("Update failed", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    loading: false,
    error: null as string | null,
    message: "",
    users: [] as any[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // addToken cases
      .addCase(addToken.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = "";
      })
      .addCase(addToken.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Token saved successfully";
      })
      .addCase(addToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getUsers cases
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // updateProfile cases
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Update the user in users array
        const updatedUser = action.payload;
        if (updatedUser && updatedUser.id) {
          const index = state.users.findIndex((u) => u.id === updatedUser.id);
          if (index !== -1) {
            state.users[index] = updatedUser;
          } else {
            // Optionally add new user if not found
            state.users.push(updatedUser);
          }
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // changePassword cases
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = "";
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload?.message || "Password changed successfully";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const profileReducer = profileSlice.reducer;
