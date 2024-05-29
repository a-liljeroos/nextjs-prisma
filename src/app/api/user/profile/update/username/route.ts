import prisma from "@prisma/prismaClient";
import { db } from "@prisma/db";
import { auth } from "@serverAuth";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

// api/user/profile/update/username

const schema = z
  .object({
    newUsername: z.string().min(6).max(32),
  })
  .required();

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const currentUsername = session?.user?.name;

    if (!session || !currentUsername) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { newUsername } = result.data;
    const isTaken = (await db.getUserByName(newUsername)) || [];

    if (isTaken.length > 0) {
      return NextResponse.json({ error: "Conflict." }, { status: 409 });
    }

    const user = await db.getUserByName(currentUsername);

    await prisma.user.update({
      where: { name: currentUsername },
      data: { name: newUsername },
    });

    return NextResponse.json({ message: "Username changed." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
