import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@crudFunctions";

const useGetPosts = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["posts", "frontpage"],
    queryFn: () => getPosts(),
  });
  return { data, isLoading, isError, refetch };
};

export default useGetPosts;
