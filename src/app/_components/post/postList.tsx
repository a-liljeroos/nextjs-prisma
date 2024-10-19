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
    <div className="posts-cont h-full flex flex-col gap-5 rounded-lg">
      {posts && posts.length === 0 && (
        <div className="text-center p-24 select-none text-xl">No posts 🙄</div>
      )}
      {posts && (
        <ul>
          {posts.map((post, index) => {
            const del = delayValues[index].y;
            return (
              <ListItem
                key={index}
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
    published: boolean;
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
  const animationClass = animate ? "" : " animate-post-list-item ";

  return (
    <li
      key={post.id}
      className={`post-list-item flex items-center justify-between px-3 font-semibold transition backdrop-blur-sm
        ${animationClass} ${post.published ? "" : "post-list-unpublished"}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <Link className="w-full" href={`/${authorName}/${post.id}`}>
        <div className="flex items-baseline py-6 px-5 text-pretty">
          <h2 className="post-list-item-title">{post.title}</h2>
        </div>
      </Link>
      {isOwner && (
        <PostOperations postId={post.id.toString()} user={authorName} />
      )}
    </li>
  );
};

export default PostList;
