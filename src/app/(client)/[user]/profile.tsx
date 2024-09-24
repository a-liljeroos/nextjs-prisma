"use client";
import Link from "next/link";
// react-query
import { useQuery } from "@tanstack/react-query";
import getUserPosts from "./_fetchProfile/getUserPosts";
// types
import { ProfileFetch } from "@types";
// components
import PostList from "@components/post/postList";
import Spinner from "@components/spinner/spinner";
import ErrorMsg1 from "@components/spinner/errorMsg1";
import PageContainer from "@components/pageContainer/pageContainer";
import ProfileHeader from "./_components/profileHeader";
import ErrorPage from "@components/errorPage/errorPage";
// styles
import "./profile.scss";

interface ProfileProps {
  profile: ProfileFetch;
  isOwner: boolean;
}

const Profile = ({ profile, isOwner }: ProfileProps) => {
  if (!profile) {
    return <ErrorPage message={"Page not found."} />;
  }

  return (
    <PageContainer>
      <ProfileHeader profile={profile} name={profile.name} isOwner={isOwner} />
      <div
        className="profile-bio-cont bg-neutral-600"
        style={{ marginTop: -1 }}
      >
        <h2 className="text-backgroundSecondary text-lg text-pretty w-7/12 min-h-7">
          {profile?.profile?.bio && profile?.profile?.bio}
        </h2>
      </div>
      <FetchPosts name={profile.name} isOwner={isOwner} />
    </PageContainer>
  );
};

interface FetchPostsProps {
  name: string;
  isOwner: boolean;
}

const FetchPosts = ({ name, isOwner }: FetchPostsProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts", name],
    queryFn: () => getUserPosts({ name: name }),
  });

  return (
    <>
      <div className="flex items-baseline gap-2 pt-6">
        <h1 className="text-xl px-5">Posts</h1>{" "}
        {isOwner && (
          <Link href={`/post/write`}>
            <button>Write New</button>
          </Link>
        )}
      </div>
      {isError && <ErrorMsg1 message="Failed to load posts." />}
      {isLoading && (
        <div className="flex justify-center items-center h-52">
          <Spinner />
        </div>
      )}
      {!isLoading && <PostList posts={data?.posts} name={name}></PostList>}
    </>
  );
};

export default Profile;
