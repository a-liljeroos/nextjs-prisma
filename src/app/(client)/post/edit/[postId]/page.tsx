import { redirect } from "next/navigation";
// functions
import { getPost, getUserId } from "@crudFunctions";
// auth
import { auth } from "@serverAuth";
// context
import { WritePostContextProvider } from "../../writePostContext";
// components
import EditPost from "./editPost";
import ErrorPage from "@components/errorPage/errorPage";

const EditPostPage = async ({ params }: { params: { postId: string } }) => {
  try {
    const session = await auth();
    const postId = params.postId;
    const postIdNumber = parseInt(postId);

    if (!session || isNaN(postIdNumber) || postIdNumber < 1) {
      redirect("/");
    }

    const user = session.user?.name;

    if (!user) {
      redirect("/");
    }

    const userId = await getUserId(user);

    const post = await getPost(postIdNumber);

    const unknownError = !userId;

    const isAuthorized = post?.authorId === userId!.id;

    const isPost = post ? true : false;

    const message = errorMessage({ unknownError, isAuthorized, isPost });

    if (unknownError || !isAuthorized || !isPost) {
      return <ErrorPage message={message} />;
    }

    return (
      <WritePostContextProvider>
        <EditPost user={user} post={post} />
      </WritePostContextProvider>
    );
  } catch (error) {
    console.error(error);
    redirect("/");
  }
};

type ErrorMessage = {
  unknownError: boolean;
  isAuthorized: boolean;
  isPost: boolean;
};

const errorMessage = ({
  unknownError,
  isAuthorized,
  isPost,
}: ErrorMessage): string => {
  if (unknownError) {
    return "Something went wrong. Try again later. 😣";
  }
  if (!isAuthorized) {
    return "You are not authorized to edit this post. ✋";
  }
  if (!isPost) {
    return "Post not found.";
  }
  return "Something went wrong. Try again later. 😣";
};

export default EditPostPage;
