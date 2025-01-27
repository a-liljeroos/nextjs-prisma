"use server";
// auth
import { auth } from "@serverAuth";
// db
import prisma from "@prisma/prismaClient";

export async function isAdmin() {
  try {
    const session = await auth();
    const name = session?.user?.name;
    if (!name) {
      return false;
    }
    const user = await prisma.user.findUnique({
      where: { name: name },
      select: {
        role: true,
      },
    });
    if (!user) {
      return false;
    }
    return user.role === "ADMIN";
  } catch (error) {
    console.error(error);
    return false;
  }
}
