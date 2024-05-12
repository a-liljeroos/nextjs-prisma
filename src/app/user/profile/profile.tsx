"use client";
import Link from "next/link";
// react-query
import { useQuery } from "@tanstack/react-query";
import getProfile from "./fetch/getProfile";
// functions
import formatDate from "@functions";
// styles
import "./profile.scss";

interface ProfileProps {
  name: string;
}

const Profile = ({ name }: ProfileProps) => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["profile", name],
    queryFn: () => getProfile({ name: name }),
  });

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
            <div>
              <Link href="/user/profile/edit">
                <button>Edit Profile</button>
              </Link>
            </div>
          </section>
        </div>
      </header>
      <div className="profile-bio-cont">
        <h1>{user?.profile?.bio}</h1>
      </div>
      <div className="profile-posts-cont">
        <div className="flex items-baseline ">
          <h1>Posts</h1>{" "}
          <Link href="/user/post/write">
            <button>Write New</button>
          </Link>
        </div>
        {user?.posts && user.posts.length === 0 && (
          <div className="text-center p-24 select-none text-xl">
            No posts 🙄
          </div>
        )}
        {user?.posts && (
          <ul>
            {user.posts.map((post) => {
              return (
                <li key={post.id}>
                  <Link href={`/post/${post.id}`}>
                    <div className="flex items-baseline">
                      <h2>{post.title}</h2>
                      <p>- {formatDate(post.createdAt)}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
};

export default Profile;
