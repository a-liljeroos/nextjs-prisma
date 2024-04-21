import { db } from "@prisma/db";
import prisma from "@prisma/prismaClient";
import { auth } from "@serverAuth";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

// api/user/login

const schema = z.object({
  name: z.string(),
});

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
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { name } = result.data;

    const userAndProfile = await prisma.user.findUnique({
      where: { name: name },
      select: {
        createdAt: true,
        email: true,
        id: true,
        name: true,
        role: true,
        profile: true,
        posts: {
          select: {
            title: true,
            createdAt: true,
            id: true,
            published: true,
          },
        },
      },
    });

    if (!userAndProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userAndProfile, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
