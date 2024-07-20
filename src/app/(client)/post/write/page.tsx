import { redirect } from "next/navigation";
// auth
import { auth } from "@serverAuth";
// context
import { WritePostContextProvider } from "../writePostContext";
// components
import WritePost from "./writePost";

const WritePostPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const user = session.user?.name;

  if (!user) {
    redirect("/");
  }

  return (
    <WritePostContextProvider>
      <WritePost user={user} />
    </WritePostContextProvider>
  );
};

export default WritePostPage;
