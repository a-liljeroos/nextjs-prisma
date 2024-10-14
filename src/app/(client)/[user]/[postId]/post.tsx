"use client";
import React, { useState } from "react";
import Link from "next/link";
// types
import { PostContent, Post as TPost } from "@types";
// components
import CommentSection from "@components/comments/commentSection";
import PostOperations from "@components/post/postOperations";
import PageContainer from "@components/pageContainer/pageContainer";
import Image from "next/image";
// styles
import "./post.scss";

interface PostProps {
  post: TPost;
  postId: string;
  user: string;
  isOwner: boolean;
}

const Post = ({ postId, user, isOwner, post }: PostProps) => {
  return (
    <PageContainer>
      <div className="p-4">
        <DisplayPost post={post} />
        <div className="flex items-center justify-between py-10">
          <PostInfo
            author={post.author}
            created={post.createdAt}
            updated={post.updatedAt}
          />
          {isOwner && <PostOperations postId={postId} user={user} />}
        </div>
        <CommentSection postId={postId} />
      </div>
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
      <div className="display-post pt-10">
        <Title content={post.title} />
        <div className="flex">
          <div className="bg-neutral-700/70 shadow-lg" style={{ width: 30 }} />
          <div>
            {content.map((item, index) => {
              if (index === 0) {
                return (
                  <FirstParagraph key={item.index} content={item.content} />
                );
              } else if (item.type === "Subheader") {
                return <SubHeader key={item.index} content={item.content} />;
              } else if (item.type === "Paragraph") {
                return <Paragraph key={item.index} content={item.content} />;
              } else if (item.type === "Image") {
                return (
                  <ImageContent
                    key={item.index}
                    content={item.content}
                    description={item.description}
                  />
                );
              }
            })}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return <div className="p-3">Could not load post.</div>;
  }
};

const Title = ({ content }: { content: string }) => {
  return (
    <div className=" bg-neutral-800/50 shadow-xl">
      <h1
        className="flex items-center font-bold pl-4 pr-8 text-white text-pretty scale-110 scale-x-100"
        style={{ marginTop: 10, fontSize: 32, lineHeight: 0.95 }}
      >
        {content}
      </h1>
    </div>
  );
};

const FirstParagraph = ({ content }: { content: string }) => {
  return (
    <p
      className="pl-3 py-2 mt-6 mb-6 text-balance text-white border-l-4 border-neutral-700/70 shadow-l"
      style={{ lineHeight: 1.15, fontSize: 18, maxWidth: "95%" }}
    >
      {content}
    </p>
  );
};

const SubHeader = ({ content }: { content: string }) => {
  return (
    <h2
      className="inline-block font-semibold p-3 pb-2 mt-2 text-white relative translate-y-1"
      style={{ lineHeight: 1.1, fontSize: 24 }}
    >
      {content}
      <div className="absolute top-2/4 left-2 w-full h-4 bg-neutral-700/50 opacity-50 -z-10"></div>
    </h2>
  );
};

const Paragraph = ({ content }: { content: string }) => {
  return (
    <p
      className="p-3 text-pretty"
      style={{ lineHeight: 1.15, fontSize: 18, maxWidth: "95%" }}
    >
      {content}
    </p>
  );
};

const ImageContent = ({
  content,
  description,
}: {
  content: string;
  description?: string;
}) => {
  return (
    <div className="p-3 my-2">
      <div className="shadow-xl">
        <Image
          src={content}
          alt={description || "image"}
          width={500}
          height={500}
          layout="responsive"
          className="rounded-lg"
        />
        {description && <p className="mt-2">{description}</p>}
      </div>
    </div>
  );
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
      {created && (
        <p>
          {created.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
          })}{" "}
          -{" "}
          {created.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
      )}
      {updated && created !== updated && (
        <p>
          updated:{" "}
          {updated.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
          })}{" "}
          -{" "}
          {updated.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
      )}
    </div>
  );
};
