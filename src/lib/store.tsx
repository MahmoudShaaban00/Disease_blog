import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // ✅ Make sure path is correct
import {loginReducer} from "./loginSlice"; // ✅ Make sure path is correct
import { postsReducer } from "./postsSlice"; // ✅ Make sure path is correct
import { profileReducer } from "./profileSlice";
import { commentReducer } from "./commentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // ✅ must be an object of reducers
    login: loginReducer, // ✅ must be an object of reducers
    posts : postsReducer, // ✅ must be an object of reducers
    profile: profileReducer,
    comment : commentReducer,
  },
});

