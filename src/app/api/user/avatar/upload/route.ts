import { NextResponse, NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
// db
import { put } from "@vercel/blob";
import type { PutBlobResult } from "@vercel/blob";
import prisma, { Prisma } from "@prisma/prismaClient";
// auth
import { auth } from "@serverAuth";
// functions
import { getUserId } from "@crudFunctions";
import { isImage } from "@postFunctions";
import { randomUUID } from "crypto";
const sharp = require("sharp");

// api/user/avatar/upload

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.name) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    const { name } = session.user;

    if (!request.body) {
      return NextResponse.json({ error: "No file selected" }, { status: 400 });
    }

    const file = new Uint8Array(await new Response(request.body).arrayBuffer());

    if (!isImage(file)) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const userId = await getUserId(name);

    if (!userId) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const filename = randomUUID() + ".avif";
    const pathname = `/avatars/${userId.id}/${filename}`;

    const blob: PutBlobResult = await sharp(file)
      .resize({
        width: 200,
        fit: "contain",
      })
      .avif()
      .toBuffer()
      .then((data: any) => {
        return put(pathname, data, {
          access: "public",
        });
      })
      .catch((error: any) => {
        console.error("Avatar imageProcessingError", error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      });

    const imgUrl = blob.url;

    await prisma.profile.update({
      where: {
        userId: userId.id,
      },
      data: {
        image: imgUrl,
      } as Prisma.ProfileUpdateInput,
    });

    revalidatePath(`/[user]`, "page");

    return NextResponse.json(blob, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
