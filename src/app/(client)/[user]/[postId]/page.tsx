"use server";
import { redirect } from "next/navigation";
// functions
import { getPost, getAuthor } from "@crudFunctions";
// auth
import { auth } from "@serverAuth";
// components
import Post from "./post";
import ErrorPage from "@components/errorPage/errorPage";

const Page = async ({
  params,
}: {
  params: { user: string; postId: string };
}) => {
  try {
    const session = await auth();
    const { postId, user } = params;

    const postIdNumber = parseInt(postId);

    if (isNaN(postIdNumber) || postIdNumber < 1) {
      redirect("/");
    }

    let post = await getPost(postIdNumber);

    if (!post) {
      return <ErrorPage message={"Post not found."} />;
    }

    const author = await getAuthor(post.authorId);

    if (author) {
      post = {
        ...post,
        author: author,
      };
    }

    const isOwner = session?.user?.name === author;

    if (!post.published && !isOwner) {
      return <ErrorPage message={"Post not found."} />;
    }

    return <Post postId={postId} user={user} isOwner={isOwner} post={post} />;
  } catch (error) {
    console.error(error);
    return <ErrorPage message={"Something went wrong. Try again later."} />;
  }
};

export default Page;
