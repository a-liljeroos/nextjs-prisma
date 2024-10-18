"use client";
import React, { useState } from "react";
import Link from "next/link";
// types
import { PostContent, Post as TPost } from "@types";
// functions
import { useIntersectionObserver } from "@clientFunctions";
// components
import CommentSection from "@components/comments/commentSection";
import PostOperations from "@components/post/postOperations";
import PageContainer from "@components/pageContainer/pageContainer";
import Image from "next/image";
// icons
import { PiUserFill } from "react-icons/pi";
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
        <PostInfoWithCTA user={user} isOwner={isOwner} post={post} />
        <CommentSection postId={postId} />
      </div>
    </PageContainer>
  );
};

export default Post;

interface DisplayPostProps {
  post: TPost;
}

function generateDelays(n: number): number[] {
  const items: number[] = [];
  for (let i = 0; i < n; i++) {
    items.push(50 + i * 50);
  }
  return items;
}

const postContentAnimation = {
  opacity: 0,
  animation: "postContentIn 0.2s ease-out forwards",
};

const sideBarAnimation = {
  opacity: 0,
  animation: "sideBarIn 0.7s ease-in forwards",
};

const DisplayPost = ({ post }: DisplayPostProps) => {
  try {
    const content = post.content.sort((a, b) => a.index - b.index);
    const delays = generateDelays(content.length);
    return (
      <div className="display-post pt-10">
        <Title content={post.title} />
        <div className="flex">
          <div
            className="bg-neutral-700/70 shadow-lg"
            style={{ width: 30, ...sideBarAnimation }}
          />
          <div>
            {content.map((item, index) => {
              const delay = delays[index];
              if (index === 0) {
                return (
                  <FirstParagraph
                    key={item.index}
                    delay={delay}
                    content={item.content}
                  />
                );
              } else if (item.type === "Subheader") {
                return (
                  <SubHeader
                    key={item.index}
                    delay={delay}
                    content={item.content}
                  />
                );
              } else if (item.type === "Paragraph") {
                return (
                  <Paragraph
                    key={item.index}
                    delay={delay}
                    content={item.content}
                  />
                );
              } else if (item.type === "Image") {
                return (
                  <ImageContent
                    key={item.index}
                    delay={delay}
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
        style={{
          marginTop: 10,
          fontSize: 32,
          lineHeight: 0.95,
          ...postContentAnimation,
        }}
      >
        {content}
      </h1>
    </div>
  );
};

const FirstParagraph = ({
  content,
  delay,
}: {
  content: string;
  delay: number;
}) => {
  return (
    <p
      className="pl-3 py-2 mt-6 mb-6 text-balance text-white border-l-4 border-neutral-700/70 shadow-l"
      style={{
        lineHeight: 1.15,
        fontSize: 18,
        maxWidth: "95%",
        ...postContentAnimation,
        animationDelay: `${delay}ms`,
      }}
    >
      {content}
    </p>
  );
};

const SubHeader = ({ content, delay }: { content: string; delay: number }) => {
  return (
    <h2
      className="inline-block font-semibold p-3 pb-2 mt-2 text-white relative translate-y-1"
      style={{
        lineHeight: 1.1,
        fontSize: 24,
        ...postContentAnimation,
        animationDelay: `${delay}ms`,
      }}
    >
      {content}
      <div className="absolute top-2/4 left-2 w-full h-4 bg-neutral-700/50 opacity-50 -z-10"></div>
    </h2>
  );
};

const Paragraph = ({ content, delay }: { content: string; delay: number }) => {
  return (
    <p
      className="p-3 text-pretty"
      style={{
        lineHeight: 1.15,
        fontSize: 18,
        maxWidth: "95%",
        ...postContentAnimation,
        animationDelay: `${delay}ms`,
      }}
    >
      {content}
    </p>
  );
};

const ImageContent = ({
  content,
  description,
  delay,
}: {
  content: string;
  description?: string;
  delay: number;
}) => {
  return (
    <div
      className="p-3 my-2"
      style={{
        ...postContentAnimation,
        animationDelay: `${delay}ms`,
      }}
    >
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
    <div className="p-4">
      {author && (
        <div className="flex gap-1 items-center">
          <span>
            <PiUserFill size={18} color="rgb(199, 201, 80)" />
          </span>
          <Link href={`/${author}`}>
            <p
              style={{
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              {author}
            </p>
          </Link>
        </div>
      )}
      <div>
        {created && (
          <p>
            {created.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
            {" ⎯ "}
            {created.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hourCycle: "h23",
            })}
          </p>
        )}
      </div>
    </div>
  );
};

interface PostInfoWithCTAProps {
  user: string;
  isOwner: boolean;
  post: TPost;
}

const PostInfoWithCTA = ({ user, isOwner, post }: PostInfoWithCTAProps) => {
  const { id: postId, author, createdAt, updatedAt } = post;
  const [isVisible, elementRef] = useIntersectionObserver();
  return (
    <div ref={elementRef}>
      {isVisible && (
        <div
          className="flex items-center justify-between pt-4 pb-6"
          style={{ ...postContentAnimation, animationDelay: "200ms" }}
        >
          <PostInfo author={author} created={createdAt} updated={updatedAt} />
          {isOwner && <PostOperations postId={postId.toString()} user={user} />}
        </div>
      )}
    </div>
  );
};
