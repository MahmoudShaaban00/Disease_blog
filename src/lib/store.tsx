import { configureStore } from "@reduxjs/toolkit";
import {authReducer} from "./authSlice";
import {loginReducer} from "./loginSlice";
import {postsReducer} from "./postsSlice";
import {profileReducer} from "./profileSlice";
import {commentReducer} from "./commentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    login: loginReducer,
    posts: postsReducer,
    profile: profileReducer,
    comment: commentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
