import useGetPosts from "./useGetPosts";
// components
import PostList from "./postList";
import Spinner from "@components/spinner/spinner";
import ErrorMsg1 from "@components/spinner/errorMsg1";
// styles
import "./frontPagePosts.scss";

const FrontPagePosts = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <FetchPosts />
    </div>
  );
};

const FetchPosts = () => {
  const { data, isLoading, isError } = useGetPosts();
  if (isLoading) {
    return (
      <div className="front-page-spinner">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return <ErrorMsg1 message="Failed to load posts." />;
  }

  return <>{!isLoading && <PostList posts={data} />}</>;
};

export default FrontPagePosts;
