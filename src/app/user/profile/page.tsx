// auth
import { auth } from "@serverAuth";
// react-query
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import getProfile from "./fetch/getProfile";
// components
import Profile from "./profile";

const ProfilePage = async () => {
  const queryClient = new QueryClient();
  const session = await auth();

  await queryClient.prefetchQuery({
    queryKey: ["profile", session?.user?.name ?? ""],
    queryFn: () => getProfile({ name: session?.user?.name ?? "" }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Profile name={session?.user?.name ?? ""} />
    </HydrationBoundary>
  );
};

export default ProfilePage;
