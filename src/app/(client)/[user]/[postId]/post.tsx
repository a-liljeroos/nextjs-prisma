"use client";
import Link from "next/link";
// auth
import { useSession } from "next-auth/react";
// react-query
import { useQuery } from "@tanstack/react-query";
// functions
import formatDate from "@functions";
// types
import { Post as TPost } from "@types";
// components
import PostOperations from "@components/post/postOperations";
import PageContainer from "@components/pageContainer/pageContainer";
import Spinner from "@components/spinner/spinner";
// styles
import "./post.scss";

interface PostProps {
  postId: string;
  user: string;
}

const Post = ({ postId, user }: PostProps) => {
  const { data: session } = useSession();
  const isOwner = session?.user?.name === user;
  const { data, isLoading, isError } = useQuery({
    queryKey: ["post", postId],
    queryFn: async (): Promise<TPost> => {
      const res = await fetch(`/api/post/${postId}`);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const post = await res.json();
      return post;
    },
  });

  if (isError) {
    return (
      <PageContainer>
        <div className="text-center p-10">Post not found.</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {isLoading && (
        <div className="post-page-spinner">
          <Spinner />
        </div>
      )}
      {!isLoading && (
        <div className="p-4">
          <DisplayPost post={data!} />
          <div className="flex items-center justify-between">
            <PostInfo
              author={data?.author!}
              created={data?.createdAt}
              updated={data?.updatedAt}
            />
            {isOwner && <PostOperations postId={postId} user={user} />}
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Post;

interface DisplayPostProps {
  post: TPost;
}

const DisplayPost = ({ post }: DisplayPostProps) => {
  try {
    const content = post.content.sort((a, b) => a.index - b.index);
    return (
      <div className="display-post">
        <Title content={post.title} />
        {content.map((item, index) => {
          if (index === 0) {
            return <FirstParagraph key={item.index} content={item.content} />;
          } else if (item.type === "Subheader") {
            return <SubHeader key={item.index} content={item.content} />;
          } else {
            return <Paragraph key={item.index} content={item.content} />;
          }
        })}
        {content.length > 1 && (
          <div style={{ marginBlock: 20, paddingInline: 10 }}>
            <hr />
          </div>
        )}
      </div>
    );
  } catch (error) {
    return <div className="p-3">Could not load post.</div>;
  }
};

const Title = ({ content }: { content: string }) => {
  return (
    <div className="py-3.5">
      <h1
        className="text-2xl p-3 text-green-200 text-pretty"
        style={{ marginTop: 10 }}
      >
        {content}
      </h1>
    </div>
  );
};

const FirstParagraph = ({ content }: { content: string }) => {
  return <p className="p-3 py-3.5 text-balance bg-neutral-800">{content}</p>;
};

const SubHeader = ({ content }: { content: string }) => {
  return (
    <div>
      <h2 className="text-lg p-3 mt-4 text-green-200">{content}</h2>
    </div>
  );
};

const Paragraph = ({ content }: { content: string }) => {
  return <p className="p-3 w-11/12 text-pretty">{content}</p>;
};

const PostInfo = ({
  author,
  created,
  updated,
}: {
  author: string;
  created?: Date;
  updated?: Date;
}) => {
  return (
    <div className="p-3 ">
      {author && (
        <Link href={`/${author}`}>
          <p className="text-lg underline"> {author}</p>
        </Link>
      )}
      {created && <p>{formatDate(created)}</p>}
      {updated && created !== updated && <p>updated: {formatDate(updated)}</p>}
    </div>
  );
};
