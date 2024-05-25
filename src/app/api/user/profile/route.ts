import prisma from "@prisma/prismaClient";
import { auth } from "@serverAuth";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

// api/user/profile

const schema = z.object({
  name: z.string(),
});

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

    const isOwner = session?.user?.name === name;

    const userProfile = await prisma.user.findUnique({
      where: { name: name },
      select: {
        id: true,
        name: true,
        email: isOwner,
        role: isOwner,
        createdAt: true,
        profile: {
          select: {
            bio: true,
          },
        },
      },
    });

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
