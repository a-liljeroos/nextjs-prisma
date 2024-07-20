import { redirect } from "next/navigation";
// react-query
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPost } from "@crudFunctions";
// auth
import { auth } from "@serverAuth";
// context
import { WritePostContextProvider } from "../../writePostContext";
// components
import EditPost from "./editPost";

const EditPostPage = async ({ params }: { params: { postId: string } }) => {
  const session = await auth();
  const postId = params.postId;
  const postIdNumber = parseInt(postId);

  if (!session || isNaN(postIdNumber)) {
    redirect("/");
  }

  const user = session.user?.name;

  if (!user) {
    redirect("/");
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["post", postId],
    queryFn: () => getPost(postIdNumber),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WritePostContextProvider>
        <EditPost postId={postIdNumber} user={user} />
      </WritePostContextProvider>
    </HydrationBoundary>
  );
};

export default EditPostPage;
