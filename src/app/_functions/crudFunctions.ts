"use server";
import prisma from "@prisma/prismaClient";
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
