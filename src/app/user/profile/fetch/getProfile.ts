import toast from "react-hot-toast";

interface useGetUserProfileReturn {
  name: string;
  id: number;
  email: string | null;
  createdAt: Date;
  role: string;
  posts:
    | {
        id: number;
        createdAt: Date;
        title: string;
        published: boolean;
      }[]
    | null;
  profile: {
    id: number;
    bio: string | null;
    userId: number;
  } | null;
}

const getProfile = async ({
  name,
}: {
  name: string;
}): Promise<useGetUserProfileReturn | undefined | null> => {
  const res = await fetch("/api/user/profile", {
    method: "POST",
    body: JSON.stringify({ name: name }),
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
