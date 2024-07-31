"use server";
import prisma, { Prisma } from "@prisma/prismaClient";
import { Post } from "@types";
import { auth } from "@serverAuth";

export const deletePost = async (postId: number) => {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.name) {
    throw new Error("You are not authenticated.");
  }
  const userId = await prisma.user.findUnique({
    where: {
      name: user.name,
    },
    select: {
      id: true,
    },
  });
  if (!userId) {
    throw new Error("User not found.");
  }
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      authorId: true,
    },
  });
  if (post?.authorId !== userId.id) {
    throw new Error("You are not the author of this post.");
  }
  const deletedPost = await prisma.post.delete({
    where: {
      id: postId,
    },
  });
  return deletedPost;
};

export const editPost = async (post: Post) => {
  const editedPost = await prisma.post.update({
    where: {
      id: post.id,
    },
    data: {
      title: post.title,
      content: post.content,
      published: post.published,
    } as Prisma.PostUpdateInput,
  });
  return editedPost;
};

type TGetPostReturn =
  | {
      id: number;
      title: string;
      createdAt: Date;
      published: boolean;
      author: {
        name: string;
      };
    }[]
  | null
  | undefined;

export const getPosts = async (): Promise<TGetPostReturn> => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      createdAt: true,
      published: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  });
  return posts;
};

export const getPost = async (postId: number) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });
  return post as Post;
};

export const getUserId = async (name: string) => {
  const userId = await prisma.user.findUnique({
    where: {
      name: name,
    },
    select: {
      id: true,
    },
  });
  return userId;
};

export const getAuthor = async (authorId: number) => {
  const author = await prisma.user.findUnique({
    where: {
      id: authorId,
    },
    select: {
      name: true,
    },
  });
  return author?.name;
};
