"use client";
import { useQuery } from "@tanstack/react-query";
import getProfile from "./fetch/getProfile";

interface ProfileProps {
  name: string;
}

const Profile = ({ name }: ProfileProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["profile", name],
    queryFn: () => getProfile({ name: name }),
  });

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Profile;
