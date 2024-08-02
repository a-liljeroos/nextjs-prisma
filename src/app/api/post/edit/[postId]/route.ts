import { auth } from "@serverAuth";
import { Post } from "@types";
import { getPost, getUserId, editPost } from "@crudFunctions";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

// api/post/edit/[postId]/route.ts

const postSchema = z
  .object({
    id: z.number(),
    title: z.string().min(2).max(100),
    author: z.string(),
    authorId: z.number(),
    published: z.boolean(),
    content: z
      .array(
        z.object({
          index: z.number(),
          type: z.enum(["Subheader", "Paragraph"]),
          content: z.string(),
          inputId: z.string().optional(),
        })
      )
      .min(1)
      .max(30),
  })
  .required();

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = postSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const sessionAuthor = session.user?.name;

    if (result.data.author !== sessionAuthor) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const post: Post = result.data;

    const existingPost = await getPost(post.id);
    const sessionUserId = await getUserId(sessionAuthor);

    if (!existingPost) {
      return NextResponse.json({ message: "Post not found." }, { status: 404 });
    }

    if (existingPost.authorId !== sessionUserId!.id) {
      return NextResponse.json(
        { message: "You are not the author of this post." },
        { status: 401 }
      );
    }

    await editPost(post);

    return NextResponse.json({ message: "Post updated." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
