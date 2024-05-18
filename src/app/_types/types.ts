export type PostContent = {
  index: number;
  type: "Subheader" | "Paragraph";
  content: string;
  inputId?: string;
};

export type Post = {
  id?: number;
  author: string;
  title: string;
  content: PostContent[];
  createdAt?: Date;
  updatedAt?: Date;
  authorId?: number;
  published?: boolean;
};
