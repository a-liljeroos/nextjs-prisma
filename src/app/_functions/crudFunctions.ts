"use server";
import prisma, { Prisma } from "@prisma/prismaClient";
import {
  Post,
  PostContent,
  Comment,
  PostCommentFetch,
  ProfileCommentFetch,
} from "@types";
import { auth } from "@serverAuth";
import { del } from "@vercel/blob";

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
  });

  if (post?.authorId !== userId.id) {
    throw new Error("You are not the author of this post.");
  }

  const content = post.content as PostContent[];

  // Delete images from the blob storage
  try {
    let imageUrls: string[] = [];
    if (content)
      content.map(async (item) => {
        if (item.type === "Image") {
          imageUrls.push(item.content);
        }
      });
    await del(imageUrls);
  } catch (error: any) {
    console.log("Error on deleting images: ", error);
  }

  // Delete the post from the database
  const deletedPost = await prisma.post.delete({
    where: {
      id: postId,
    },
  });
  return deletedPost;
};

export const editPost = async (post: Post) => {
  const { id, imageFolder, title, author, content, published } = post;
  const editedPost = await prisma.post.update({
    where: {
      id: post.id,
    },
    data: {
      imageFolder,
      title,
      content,
      published,
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
    where: {
      published: true,
    },
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
  return post as Post | null;
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

export const getClientUserId = async () => {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.name) {
    throw new Error("User not found.");
  }
  const userId = await prisma.user.findUnique({
    where: {
      name: user.name,
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

export const addComment = async (postId: number, content: string) => {
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
  const comment = await prisma.comment.create({
    data: {
      postId,
      authorId: userId.id,
      content: content.trim(),
    },
  });
  return comment;
};

export const getComment = async (commentId: number) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });
  return comment as Comment | null;
};

export const getComments = async (postId: number) => {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      contentHistory: true,
      author: {
        select: {
          name: true,
          profile: { select: { image: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return comments as unknown as PostCommentFetch[] | null;
};

export const getCommentsByUser = async (name: string) => {
  const comments = await prisma.user.findUnique({
    where: {
      name: name,
    },
    select: {
      comments: {
        where: {
          post: {
            published: true,
          },
        },
        select: {
          id: true,
          content: true,
          contentHistory: true,
          createdAt: true,
          postId: true,
          post: {
            select: {
              title: true,
              author: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  const commentsArray = comments?.comments;
  return commentsArray as ProfileCommentFetch[] | null;
};

export const deleteComment = async (commentId: number) => {
  try {
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
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (comment?.authorId !== userId.id) {
      throw new Error("You are not the author of this comment.");
    }
    const deletedComment = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    if (!deletedComment) {
      throw new Error("Comment not found.");
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 *  Check if a conversation exists between the current user and the candidate user.
 * @param candidateUserId
 * @returns conversationId or null
 */

export const conversationExist = async (candidateUserId: number) => {
  try {
    const session = await auth();
    const currentUsername = session?.user?.name;
    if (!currentUsername) {
      throw new Error("User not found.");
    }
    const conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: candidateUserId } } },
          { participants: { some: { user: { name: currentUsername } } } },
        ],
      },
      select: { id: true },
    });
    if (!conversation) {
      return null;
    }
    return conversation.id;
  } catch (error) {
    console.error(error);
    return null;
  }
};
