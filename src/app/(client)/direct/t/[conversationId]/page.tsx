"use server";
import { redirect } from "next/navigation";
import prisma from "@prisma/prismaClient";
// types
import { TConversation } from "@types";
// auth
import { auth } from "@serverAuth";
// functions
import { getUserId } from "@crudFunctions";
// components
import ClientPage from "./clientPage";

const Page = async ({ params }: { params: { conversationId: string } }) => {
  try {
    const session = await auth();

    if (!session || !session.user?.name) {
      redirect("/");
    }

    const conversationId = Number(params.conversationId);

    if (!Number.isInteger(conversationId) || conversationId <= 0) {
      redirect("/");
    }

    const sessionUserId = await getUserId(session.user.name);

    if (!sessionUserId) {
      redirect("/");
    }

    const conversation: TConversation | null =
      await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          participants: {
            some: { userId: sessionUserId.id },
          },
        },
        include: {
          // Include participants with the related user data
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

    if (!conversation) {
      redirect("/");
    }

    return (
      <ClientPage
        conversation={conversation}
        sessionUserId={sessionUserId.id}
      />
    );
  } catch (error) {
    console.error(error);
    redirect("/");
  }
};

export default Page;
