import prisma, { Prisma } from "@prisma/prismaClient";
import { auth } from "@serverAuth";
import { NewPost, Post } from "@types";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

// api/post/edit/[postId]/route.ts

const editPost = async (post: Post) => {
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
