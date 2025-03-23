"use server";
// auth
import { auth } from "@serverAuth";
// db
import prisma from "@prisma/prismaClient";
// functions
import { getUserId } from "@crudFunctions";

export const getConversations = async (userId: number) => {
  const conservations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId: userId },
      },
    },
    include: {
      participants: {
        select: {
          userId: true,
          conversationId: true,
          lastReadAt: true,
          user: {
            select: {
              name: true,
              profile: {
                select: {
                  image: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return conservations;
};

export const getConversationMessages = async (
  conversationId: number,
  sessionUserId: number
) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        conversation: {
          participants: {
            some: { userId: sessionUserId },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return messages;
  } catch (error) {
    console.error(error);
  }
};

export const getUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      profile: {
        select: {
          image: true,
        },
      },
    },
  });
  return user;
};

export const updateLastReadAt = async (
  conversationId: number,
  userId: number
) => {
  try {
    const result = await prisma.conversationParticipant.updateMany({
      where: {
        conversationId,
        userId,
      },
      data: {
        lastReadAt: new Date(),
      },
    });
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const createConversation = async (participants: number[]) => {
  try {
    const session = await auth();
    const userId = session?.user?.name;
    if (!userId) {
      throw new Error("User not found");
    }
    const myId = await getUserId(userId);
    if (!myId) {
      throw new Error("User not found");
    }

    participants.push(myId.id);

    const newConversation = await prisma.conversation.create({
      data: {
        participants: {
          create: participants.map((userId) => ({
            userId,
          })),
        },
      },
      select: {
        participants: true,
        id: true,
      },
    });
    return newConversation;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Sends a message in a specific conversation.
 *
 * @param conversationId - The ID of the conversation where the message will be sent.
 * @param content - The content of the message to be sent.
 * @returns A promise that resolves to the newly created message object.
 *
 * @throws Will throw an error if the user is not authenticated.
 * @throws Will throw an error if the user is not found.
 * @throws Will throw an error if the user is not a participant in the specified conversation.
 * @throws Will propagate any other errors encountered during the operation.
 */
export const sendMessage = async (conversationId: number, content: string) => {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Failed to authenticate");
    }
    const username = session?.user?.name;
    if (!username) {
      throw new Error("User not found");
    }
    const result = await prisma.$queryRaw<
      {
        id: number;
        conversationId: number;
        senderId: number;
        content: string;
        messageType: "TEXT";
        createdAt: Date;
      }[]
    >`
        INSERT INTO "Message" ("conversationId", "senderId", "content", "messageType", "createdAt")
        SELECT cp."conversationId", u."id", ${content}, 'TEXT', now()
        FROM "ConversationParticipant" cp
        JOIN "User" u ON cp."userId" = u."id"
        WHERE cp."conversationId" = ${conversationId} AND u."name" = ${username}
        RETURNING *;
      `;

    if (result.length === 0) {
      throw new Error("User is not a participant in this conversation.");
    }

    return result[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
