interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  name?: string;
  userProgilePictureUrl?: string;
  time: string;
  commentsCount?: number;
}

interface PostsState {
  allPosts: Post[];
  loading: boolean;
  error: string | null;
}

interface Comment {
  id: number;
  postId: string;
  content: string;
  name: string;
  userImageUrl?: string;
  time: string;
}

interface CommentState {
  comments: Record<string, Comment[]>;
  loading: boolean;
  error: string | null;
}

// Define other slices similarly:
interface LoginState {
  userId?: string;
  token?: string;
  loading: boolean;
  error: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  userRole?: string;
  loading: boolean;
  error: string | null;
}

interface ProfileState {
  user: {
    id: string;
    name: string;
    email: string;
    profilePictureUrl?: string;
    // more user fields...
  } | null;
  loading: boolean;
  error: string | null;
}

interface State {
  posts: PostsState;
  comment: CommentState;
  login: LoginState;
  auth: AuthState;
  profile: ProfileState;
}
