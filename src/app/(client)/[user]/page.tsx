"use server";
// auth
import { auth } from "@serverAuth";
// db
import prisma from "@prisma/prismaClient";
// react-query
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import getUserPosts from "./_fetchProfile/getUserPosts";
// types
import { ProfileFetch } from "@types";
// components
import Profile from "./profile";
import ErrorPage from "@components/errorPage/errorPage";

const ProfilePage = async ({ params }: { params: { user: string } }) => {
  try {
    const name = params.user;

    const session = await auth();

    const isOwner = session?.user?.name === name;

    const userProfile: ProfileFetch = await prisma.user.findUnique({
      where: { name: name },
      select: {
        id: true,
        name: true,
        email: isOwner,
        role: true,
        createdAt: true,
        profile: {
          select: {
            bio: true,
            image: true,
          },
        },
      },
    });

    if (!userProfile) {
      return <ErrorPage message={"Page not found."} />;
    }
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
      queryKey: ["posts", userProfile.name],
      queryFn: () => getUserPosts({ name: userProfile.name }),
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Profile profile={userProfile} isOwner={isOwner} />
      </HydrationBoundary>
    );
  } catch (error) {
    console.error(error);
    return <ErrorPage message={"Something went wrong. Try again later."} />;
  }
};

export default ProfilePage;
