import { PostsState } from "@/lib/postsSlice";
import { CommentState } from "@/lib/commentSlice";
import { LoginState } from "@/lib/loginSlice";
import { AuthState } from "@/lib/authSlice";
import { ProfileState } from "@/lib/profileSlice";

// Full global state interface
export interface State {
  posts: PostsState;
  comment: CommentState;
  login: LoginState;
  auth: AuthState;
  profile: ProfileState;
}
