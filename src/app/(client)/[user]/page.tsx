// auth
import { auth } from "@serverAuth";
// react-query
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import getProfile from "./_fetchProfile/getProfile";
// components
import Profile from "./profile";

const ProfilePage = async ({ params }: { params: { user: string } }) => {
  const queryClient = new QueryClient();
  const user = params.user;
  await queryClient.prefetchQuery({
    queryKey: ["profile", user],
    queryFn: () => getProfile({ name: user }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Profile name={user} />
    </HydrationBoundary>
  );
};

export default ProfilePage;
