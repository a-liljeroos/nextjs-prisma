import useGetPosts from "./useGetPosts";
// components
import PostList from "./postList";
import Spinner from "@components/spinner/spinner";
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
    return (
      <div className="front-page-error text-center">
        <h1>🤷</h1>
        <h2>Failed to load posts.</h2>
      </div>
    );
  }

  return <>{!isLoading && <PostList posts={data} />}</>;
};

export default FrontPagePosts;
