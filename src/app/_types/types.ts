export type ProfileFetch = {
  name: string;
  id: number;
  email: string | null;
  createdAt: Date;
  role: string;
  profile: {
    bio: string | null;
    image: string | null;
  } | null;
} | null;

export type PostContent = {
  index: number;
  type: "Subheader" | "Paragraph";
  content: string;
  inputId?: string;
};

export type Post = {
  id: number;
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
  content: PostContent[];
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
