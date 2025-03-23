"use server";
import { redirect } from "next/navigation";
// auth
import { auth } from "@serverAuth";
// functions
import { getUserId } from "@crudFunctions";
// components
import Conversations from "@components/directMessages/_components/conversations/conversations";

const Page = async () => {
  const session = await auth();
  const userName = session?.user?.name;

  if (!userName || !session) {
    redirect("/");
  }

  const sessionUserId = await getUserId(userName);

  if (!sessionUserId) {
    redirect("/");
  }

  return (
    <div className="flex flex-col h-full">
      <section>
        <Conversations sessionUserId={sessionUserId.id} />
      </section>
    </div>
  );
};

export default Page;
