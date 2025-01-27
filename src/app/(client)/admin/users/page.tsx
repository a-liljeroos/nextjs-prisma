"use server";
import { redirect } from "next/navigation";
// functions
import { getUsers, isAdmin } from "@adminFunctions";
// components
import Users from "./_components/users";

const Page = async () => {
  const admin = await isAdmin();
  if (admin === false) {
    redirect("/");
  }
  const users = await getUsers();
  return <Users users={users} />;
};

export default Page;
