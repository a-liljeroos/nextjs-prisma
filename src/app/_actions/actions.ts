"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@prisma/prismaClient";

export async function revalidatePost(url: string) {
  revalidatePath(url);
}
export async function redirectToPost(url: string) {
  redirect(url);
}

export async function deleteAvatar(userId: number) {
  try {
    await prisma.profile.update({
      where: { userId: userId },
      data: { image: null },
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
