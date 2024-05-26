import toast from "react-hot-toast";

export interface useGetUserProfileReturn {
  name: string;
  id: number;
  email?: string | null;
  createdAt: Date;
  role?: string;
  profile: {
    bio: string | null;
  };
}

const getProfile = async ({
  name,
}: {
  name: string;
}): Promise<useGetUserProfileReturn | undefined | null> => {
  const res = await fetch("/api/user/profile?name=" + name, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (res.status === 200) {
    return res.json();
  }
  if (res.status === 404) {
    toast.error("User not found.");
  }
  if (res.status === 500 || !res.ok) {
    toast.error("Could not get user profile. Please try again later.");
  }
  return null;
};

export default getProfile;
