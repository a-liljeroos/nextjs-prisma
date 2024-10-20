export type ProfileFetch = {
  name: string;
  id: number;
  email: string | null;
  createdAt: Date;
  role: string;
  profile: {
    bio: string | null;
    image: string | null | undefined;
  } | null;
} | null;

export type PostContentType = "Subheader" | "Paragraph" | "Image";

export type PostContent = {
  index: number;
  type: PostContentType;
  content: string;
  description?: string;
  inputId?: string;
  imageUpdated?: boolean;
};

export type Post = {
  id: number;
  imageFolder: string | null;
  title: string;
  author: string;
  content: PostContent[];
  createdAt?: Date;
  updatedAt?: Date;
  authorId: number;
  published: boolean;
};

export type NewPost = {
  author: string;
  title: string;
  published: boolean;
  content: PostContent[];
};

export type PostRequestImage = {
  index: number;
  image: Uint8Array;
};

export type PostRequest = {
  post: Post;
  // array of indexes of new images added to the post
  newImages: number[];
  images?: PostRequestImage[];
};

export type SearchResult = {
  posts: {
    id: number;
    authorId: number;
    title: string;
    sample?: string;
  }[];
  users: {
    name: string;
  }[];
} | null;

export type Comment = {
  id: number;
  postId: number;
  authorId: number;
  content: string;
  contentHistory: CommentContentHistory[];
  createdAt: Date;
  updatedAt: Date;
};

export type CommentContentHistory = {
  content: string;
  createdAt: Date;
};

export type PostCommentFetch = {
  id: number;
  createdAt: Date;
  content: string;
  contentHistory: CommentContentHistory[] | null;
  author: {
    name: string;
    profile: {
      image: string | null | undefined;
    } | null;
  };
};

export type ProfileCommentFetch = {
  id: number;
  createdAt: Date;
  content: string;
  contentHistory: CommentContentHistory[] | null;
  postId: number;
  post: {
    title: string;
    author: {
      name: string;
    };
  };
};
