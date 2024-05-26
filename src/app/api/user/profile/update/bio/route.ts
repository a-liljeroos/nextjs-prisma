import prisma from "@prisma/prismaClient";
import { auth } from "@serverAuth";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

// api/user/profile/update/bio

const schema = z.object({
  bio: z.string().max(160),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const session = await auth();
    if (!session || !session.user?.name) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { bio } = result.data;
    const { name } = session.user;

    const userBio = await prisma.user.update({
      where: { name: name },
      data: {
        profile: {
          update: {
            bio: bio,
          },
        },
      },
      select: {
        profile: {
          select: {
            bio: true,
          },
        },
      },
    });

    if (!userBio) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userBio, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
