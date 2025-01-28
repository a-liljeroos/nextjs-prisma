"use server";
import { redirect } from "next/navigation";
// functions
import { getUser, isAdmin } from "@adminFunctions";
// components
import UserPage from "./userPage";

const Page = async ({ params }: { params: { userId: string } }) => {
  const admin = await isAdmin();
  if (admin === false) {
    redirect("/");
  }
  const user = await getUser(parseInt(params.userId));
  if (!user) {
    redirect("/admin/users");
  }
  return <UserPage user={user} />;
};

export default Page;
