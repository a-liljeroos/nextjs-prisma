"use server";
// types
import { Post as TPost } from "@types";
// react-query
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import Post from "./post";

const Page = async ({
  params,
}: {
  params: { user: string; postId: string };
}) => {
  const { postId, user } = params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["post", postId],
    queryFn: async (): Promise<TPost> => {
      const res = await fetch(`/api/post/${postId}`);
      const post = await res.json();
      return post;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Post postId={postId} user={user} />
    </HydrationBoundary>
  );
};

export default Page;
