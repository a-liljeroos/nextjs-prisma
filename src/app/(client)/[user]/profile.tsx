"use client";
import Link from "next/link";
// auth
import { useSession } from "next-auth/react";
// react-query
import useGetProfile from "./_fetchProfile/useGetProfile";
// components
import PostList from "@components/post/postList";
// styles
import "./profile.scss";

interface ProfileProps {
  name: string;
}

const Profile = ({ name }: ProfileProps) => {
  const { data: user, isLoading } = useGetProfile(name);
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
            <h2>{user?.name}</h2>
            {isOwner && (
              <div>
                <Link href="/user/profile/edit">
                  <button>Edit Profile</button>
                </Link>
              </div>
            )}
          </section>
        </div>
      </header>
      <div className="profile-bio-cont">
        <h1>{user?.profile?.bio}</h1>
      </div>
      <PostList posts={user?.posts} name={name}>
        <div className="flex items-baseline ">
          <h1>Posts</h1>{" "}
          {isOwner && (
            <Link href={`/post/write`}>
              <button>Write New</button>
            </Link>
          )}
        </div>
      </PostList>
    </main>
  );
};

export default Profile;
