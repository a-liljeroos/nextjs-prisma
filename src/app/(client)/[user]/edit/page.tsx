import { auth } from "@serverAuth";
import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import getProfile from "../_fetchProfile/getProfile";
// components
import EditProfile from "./editProfile";

const Page = async ({ params }: { params: { user: string } }) => {
  try {
    const session = await auth();
    const user = params.user;
    const sessionUser = session?.user?.name;

    if (!session || sessionUser !== user) {
      return redirect("/");
    }

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
      queryKey: ["profile", sessionUser],
      queryFn: () => getProfile({ name: sessionUser }),
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EditProfile user={sessionUser} />
      </HydrationBoundary>
    );
  } catch (error) {
    console.error("[user]/edit", error);
    return redirect("/");
  }
};

export default Page;
