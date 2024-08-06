"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function revalidatePost(url: string) {
  revalidatePath(url);
}
export async function redirectToPost(url: string) {
  redirect(url);
}
