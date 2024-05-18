"use client";
import Link from "next/link";
// auth
import { useSession } from "next-auth/react";
// react-query
import useGetProfile from "./_fetchProfile/useGetProfile";
// components
import PostOperations from "./[postId]/postOperations";
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
            <button className="profile-img-button"></button>
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
      <UserPosts posts={user?.posts} name={name} />
    </main>
  );
};

export default Profile;

interface UserPostsProps {
  name: string;
  posts:
    | {
        id: number;
        createdAt: Date;
        title: string;
        published: boolean;
      }[]
    | null
    | undefined;
}

const UserPosts = ({ posts, name }: UserPostsProps) => {
  const { data: session } = useSession();
  const isOwner = session?.user?.name === name;

  return (
    <div className="profile-posts-cont">
      <div className="flex items-baseline ">
        <h1>Posts</h1>{" "}
        {isOwner && (
          <Link href={`/post/write`}>
            <button>Write New</button>
          </Link>
        )}
      </div>
      {posts && posts.length === 0 && (
        <div className="text-center p-24 select-none text-xl">No posts 🙄</div>
      )}
      {posts && (
        <ul>
          {posts.map((post) => {
            return (
              <li
                key={post.id}
                className="flex items-center justify-between px-3"
              >
                <Link href={`/${name}/${post.id}`}>
                  <div className="flex items-baseline">
                    <h2>{post.title}</h2>
                  </div>
                </Link>
                {isOwner && (
                  <PostOperations postId={post.id.toString()} user={name} />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
