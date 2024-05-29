import Link from "next/link";
import { useEffect } from "react";
// auth
import { useSession } from "next-auth/react";
// functions
import { getPoints } from "@functions";
// components
import PostOperations from "./postOperations";
// styles
import "./postList.scss";

type PostListProps = {
  name?: string;
  animate?: boolean;
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
};

const PostList = ({ posts, name, animate = true }: PostListProps) => {
  const { data: session } = useSession();
  const isOwner = name ? session?.user?.name === name : false;
  const delayValues = getPoints({ a: 0.3, n: posts!.length }) || [];

  return (
    <div className="posts-cont">
      {posts && posts.length === 0 && (
        <div className="text-center p-24 select-none text-xl">No posts 🙄</div>
      )}
      {posts && (
        <ul>
          {posts.map((post, index) => {
            const del = delayValues[index].y;
            return (
              <ListItem
                post={post}
                isOwner={isOwner}
                name={name}
                delay={del}
                animate={animate}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};

interface ListItemProps {
  post: {
    id: number;
    title: string;
    author?: { name: string };
  };
  isOwner: boolean;
  name?: string;
  delay: number;
  animate?: boolean;
}

const ListItem = ({
  post,
  isOwner,
  name,
  delay,
  animate = true,
}: ListItemProps) => {
  const authorName = name ? name : post.author?.name;
  const animationClass = animate ? "" : "animate-post-list-item";

  return (
    <li
      key={post.id}
      className={
        "post-list-item flex items-center justify-between px-3 font-semibold " +
        animationClass
      }
      style={{ animationDelay: `${delay}s` }}
    >
      <Link href={`/${authorName}/${post.id}`}>
        <div className="flex items-baseline">
          <h2>{post.title}</h2>
        </div>
      </Link>
      {isOwner && (
        <PostOperations postId={post.id.toString()} user={authorName} />
      )}
    </li>
  );
};

export default PostList;
