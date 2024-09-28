import prisma from "@prisma/prismaClient";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
// auth
import { auth } from "@serverAuth";

// api/user/posts

const schema = z.object({
  name: z.string(),
});

const published = {
  where: { published: true },
  select: {
    title: true,
    createdAt: true,
    id: true,
    published: true,
  },
};

const allPosts = {
  select: {
    title: true,
    createdAt: true,
    id: true,
    published: true,
  },
};

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const parsedParams = { name: params.get("name") };
    const result = schema.safeParse(parsedParams);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { name } = result.data;
    const session = await auth();
    const sessionName = session?.user?.name;
    const isOwner = sessionName === name;

    const userPosts = await prisma.user.findUnique({
      where: { name: name },
      select: {
        posts: isOwner ? allPosts : published,
      },
    });

    if (!userPosts) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userPosts, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
