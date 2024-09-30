import useGetPosts from "./useGetPosts";
// components
import PostList from "./postList";
import ErrorMsg1 from "@components/spinner/errorMsg1";
// styles
import "./frontPagePosts.scss";

const FrontPagePosts = () => {
  return (
    <div className="flex flex-col items-center w-full py-8">
      <FetchPosts />
    </div>
  );
};

const FetchPosts = () => {
  const { data, isLoading, isError } = useGetPosts();

  if (isError) {
    return <ErrorMsg1 message="Failed to load posts." />;
  }

  return <>{!isLoading && <PostList posts={data} animate={false} />}</>;
};

export default FrontPagePosts;
