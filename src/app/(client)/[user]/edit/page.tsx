import { auth } from "@serverAuth";
import { redirect } from "next/navigation";
// components
import EditProfile from "./editProfile";

const Page = async ({ params }: { params: { user: string } }) => {
  const session = await auth();

  if (!session || session.user?.name !== params.user) {
    return redirect("/");
  }
  return <EditProfile />;
};

export default Page;
