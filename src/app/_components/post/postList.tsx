import Link from "next/link";
// auth
import { useSession } from "next-auth/react";
// components
import PostOperations from "./postOperations";
// styles
import "./postList.scss";

interface PostListProps {
  name?: string;
  posts:
    | {
        id: number;
        createdAt: Date;
        title: string;
        published: boolean;
        author?: { name: string };
      }[]
    | null
    | undefined;
}

const PostList = ({ posts, name }: PostListProps) => {
  const { data: session } = useSession();
  const isOwner = name ? session?.user?.name === name : false;

  return (
    <div className="posts-cont">
      {posts && posts.length === 0 && (
        <div className="text-center p-24 select-none text-xl">No posts 🙄</div>
      )}
      {posts && (
        <ul>
          {posts.map((post) => {
            const authorName = name ? name : post.author?.name;
            return (
              <li
                key={post.id}
                className="flex items-center justify-between px-3 font-semibold hover:bg-backgroundSecondary hover:text-background"
              >
                <Link href={`/${authorName}/${post.id}`}>
                  <div className="flex items-baseline">
                    <h2>{post.title}</h2>
                  </div>
                </Link>
                {isOwner && (
                  <PostOperations
                    postId={post.id.toString()}
                    user={authorName}
                  />
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
