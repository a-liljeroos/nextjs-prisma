import prisma from "@prisma/prismaClient";
import { db } from "@prisma/db";
import { compare, hash } from "@bcrypt/functions";
import { auth } from "@serverAuth";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

// api/user/profile/update/password

const schema = z
  .object({
    currentPassword: z.string().min(6).max(32),
    newPassword: z.string().min(6).max(32),
    confirmNewPassword: z.string().min(6).max(32),
  })
  .required();

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const name = session?.user?.name;

    if (!session || !name) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { currentPassword, newPassword, confirmNewPassword } = result.data;

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json(
        { error: "New password and confirm password do not match." },
        { status: 400 }
      );
    }

    const user = await db.getUserByName(name);
    const match = await compare(currentPassword, user![0].password);

    if (!match) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hashedPassword = await hash(newPassword);

    await prisma.user.update({
      where: { name: name },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password changed." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
