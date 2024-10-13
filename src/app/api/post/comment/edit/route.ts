import { NextResponse, NextRequest } from "next/server";
import prisma, { Prisma } from "@prisma/prismaClient";
// auth
import { auth } from "@serverAuth";
// types and validation
import { editCommentSchema } from "@zValidation";
import { Comment, CommentContentHistory } from "@types";
// functions
import { getComment } from "@crudFunctions";

// api/post/comment/edit/route.ts

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user?.name) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }
    const body = await req.formData();
    const commentBody = body.get("comment") as string;
    const commentResult = editCommentSchema.safeParse(JSON.parse(commentBody));

    if (!commentResult.success) {
      console.log("commentResult.error: ", commentResult.error.cause);
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const comment = commentResult.data;
    const commentId = comment.commentId;
    const content = comment.content;

    const userId = await prisma.user.findUnique({
      where: {
        name: session.user.name,
      },
      select: {
        id: true,
      },
    });

    if (!userId) {
      throw new Error("User not found.");
    }

    const oldComment = await getComment(commentId);

    if (oldComment?.authorId !== userId.id) {
      throw new Error("You are not the author of this comment.");
    }

    let contentHistory: CommentContentHistory[] = [];

    if (oldComment.contentHistory) {
      contentHistory = oldComment.contentHistory;
    }

    contentHistory.push({
      content: oldComment.content,
      createdAt: new Date(oldComment.updatedAt),
    });

    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: content,
        contentHistory: contentHistory as unknown as Prisma.JsonArray,
      },
    });

    return NextResponse.json({ message: "Comment edited." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
