import prisma, { Prisma } from "@prisma/prismaClient";
import { auth } from "@serverAuth";
import { Post } from "@types";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

// api/post/write/route.ts

const createPost = async (post: Post) => {
  const { author, title, content } = post;
  const newPost = await prisma.post.create({
    data: {
      author: {
        connect: {
          name: author,
        },
      },
      title: title,
      content: content as Prisma.JsonArray,
    },
  });
  return newPost;
};

const postSchema = z
  .object({
    author: z.string(),
    title: z.string().min(2).max(100),
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

export async function POST(req: NextRequest) {
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

    const author = session.user?.name;

    if (result.data.author !== author) {
      return NextResponse.json(
        { message: "You can only create posts for yourself." },
        { status: 401 }
      );
    }

    const post: Post = result.data;

    await createPost(post);

    return NextResponse.json({ message: "Post created." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
