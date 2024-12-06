import prisma, { Prisma } from "@prisma/prismaClient";
import { Post } from "@types";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

// api/post/[postId]/route.ts

const getPost = async (postId: number) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
  return post;
};

const getAuthor = async (authorId: number) => {
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

const schema = z
  .object({
    postId: z.number(),
  })
  .required();

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const reg = /^\d+$/;
    if (!reg.test(params.postId)) {
      return NextResponse.json(
        { error: "postId must be a number" },
        { status: 400 }
      );
    }
    const parsedParams = { postId: parseInt(params.postId) };
    const result = schema.safeParse(parsedParams);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    let post = await getPost(result.data.postId);

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    let author = await getAuthor(post.authorId);

    const response = {
      ...post,
      author,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
