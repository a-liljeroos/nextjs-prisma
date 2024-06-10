"use server";
import prisma from "@prisma/prismaClient";

export async function getUsername(authorId: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(authorId) },
      select: { name: true },
    });

    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}
