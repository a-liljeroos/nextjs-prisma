// react-query
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import getProfile from "./_fetchProfile/getProfile";
import getUserPosts from "./_fetchProfile/getUserPosts";
// components
import Profile from "./profile";

const ProfilePage = async ({ params }: { params: { user: string } }) => {
  const queryClient = new QueryClient();
  const user = params.user;
  await queryClient.prefetchQuery({
    queryKey: ["profile", user],
    queryFn: () => getProfile({ name: user }),
  });
  await queryClient.prefetchQuery({
    queryKey: ["posts", user],
    queryFn: () => getUserPosts({ name: user }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Profile name={user} />
    </HydrationBoundary>
  );
};

export default ProfilePage;
