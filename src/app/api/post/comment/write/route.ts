import { NextResponse, NextRequest } from "next/server";
// auth
import { auth } from "@serverAuth";
// functions
import { addComment } from "@crudFunctions";
// types and validation
import { commentSchema } from "@zValidation";

// api/post/comment/write/route.ts

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
    const commentResult = commentSchema.safeParse(JSON.parse(commentBody));

    if (!commentResult.success) {
      console.log("commentResult.error: ", commentResult.error.cause);
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const comment = commentResult.data;
    const postId = comment.postId;
    const content = comment.content;
    await addComment(postId, content);
    return NextResponse.json({ message: "Comment added." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
