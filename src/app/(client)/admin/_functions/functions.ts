"use server";
// auth
import { auth } from "@serverAuth";
// types
import { TUserRoles, UserRoles } from "@types";
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
    return user.role === UserRoles.ADMIN;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        role: true,
      },
    });
    return users;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function updateUserRole(id: number, role: TUserRoles) {
  const admin = await isAdmin();
  if (admin === false) {
    return null;
  }
  try {
    const user = await prisma.user.update({
      where: { id: id },
      data: {
        role: role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}
