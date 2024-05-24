// react-query
import { useQuery } from "@tanstack/react-query";
import getProfile from "./getProfile";

const useGetProfile = (name: string) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["profile", name],
    queryFn: () => getProfile({ name: name }),
  });

  return { data, isLoading, isError, refetch };
};

export default useGetProfile;
