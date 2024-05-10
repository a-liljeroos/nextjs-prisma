import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import Register from "./register";

export default async function RegisterPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }
  return <Register />;
}
