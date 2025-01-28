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

export async function getUser(id: number) {
  const admin = await isAdmin();
  if (admin === false) {
    return null;
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        password: true,
        posts: {
          select: {
            id: true,
            title: true,
            published: true,
            createdAt: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            post: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    return null;
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

export async function deleteUser(id: number) {
  const admin = await isAdmin();
  if (admin === false) {
    return null;
  }
  try {
    const user = await prisma.user.delete({
      where: { id: id },
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

export async function deletePost(id: number) {
  const admin = await isAdmin();
  if (admin === false) {
    throw new Error("Unauthorized access");
  }
  try {
    const post = await prisma.post.delete({
      where: { id: id },
      select: {
        id: true,
      },
    });
    return post;
  } catch (error) {
    console.error(error);
    throw new Error("Database deletion error");
  }
}
