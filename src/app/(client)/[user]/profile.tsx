"use client";
import Link from "next/link";
// auth
import { useSession } from "next-auth/react";
// react-query
import { useQuery } from "@tanstack/react-query";
import getProfile from "./_fetchProfile/getProfile";
import getUserPosts from "./_fetchProfile/getUserPosts";
// components
import PostList from "@components/post/postList";
import Spinner from "@components/spinner/spinner";
import ErrorMsg1 from "@components/spinner/errorMsg1";
// styles
import "./profile.scss";

interface ProfileProps {
  name: string;
}

const Profile = ({ name }: ProfileProps) => {
  const profile = useQuery({
    queryKey: ["profile", name],
    queryFn: () => getProfile({ name: name }),
  });
  const { data: session } = useSession();
  const isOwner = session?.user?.name === name;

  return (
    <main>
      <header>
        <div className="flex p-5">
          <div>
            <button
              className="profile-img-button"
              style={{ borderBottom: "initial" }}
            ></button>
            <div>
              <form action="" id="profile-img-change">
                <input type="file" accept="image/jpeg,image/png" />
              </form>
            </div>
          </div>
          <section className="profile-header-section">
            <h2>{name}</h2>
            {isOwner && (
              <div>
                <Link href={`/${name}/edit`}>
                  <button>Edit Profile</button>
                </Link>
              </div>
            )}
          </section>
        </div>
      </header>
      <div className="profile-bio-cont">
        <h1>{!profile.isLoading && profile.data?.profile?.bio}</h1>
      </div>
      <FetchPosts name={name} isOwner={isOwner} />
    </main>
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
      <div className="flex items-baseline gap-2">
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
