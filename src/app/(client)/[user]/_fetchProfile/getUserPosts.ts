import toast from "react-hot-toast";

interface useGetUserPostsReturn {
  posts:
    | {
        title: string;
        id: number;
        createdAt: Date;
        published: boolean;
      }[]
    | null;
}

const getUserPosts = async ({
  name,
}: {
  name: string;
}): Promise<useGetUserPostsReturn | undefined | null> => {
  const res = await fetch("/api/user/posts?name=" + name, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (res.status === 200) {
    return res.json();
  }
  if (res.status === 404) {
    return null;
  }
  if (res.status === 500 || !res.ok) {
    toast.error("Could not get user profile. Please try again later.");
  }
  return null;
};

export default getUserPosts;
