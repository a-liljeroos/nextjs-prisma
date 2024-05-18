import Link from "next/link";
// auth
import { useSession } from "next-auth/react";
// components
import PostOperations from "./postOperations";

interface PostListProps {
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

const PostList = ({ posts, name }: PostListProps) => {
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

export default PostList;
