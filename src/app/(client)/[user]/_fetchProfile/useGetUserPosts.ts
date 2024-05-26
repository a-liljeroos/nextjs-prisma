// react-query
import { useQuery } from "@tanstack/react-query";
import getUserPosts from "./getUserPosts";

const useGetUserPosts = (name: string) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["profile", name],
    queryFn: () => getUserPosts({ name: name }),
  });

  return { data, isLoading, isError, refetch };
};

export default useGetUserPosts;
