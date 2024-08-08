import toast from "react-hot-toast";
import { ProfileFetch } from "@types";

const getProfile = async ({
  name,
}: {
  name: string;
}): Promise<ProfileFetch | undefined | null> => {
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
