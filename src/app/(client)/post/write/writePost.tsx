"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// react-query
import { useMutation } from "@tanstack/react-query";
// types
import { Post, NewPost } from "@types";
// context
import { useWritePostContext } from "../writePostContext";
// components
import PageContainer from "@components/pageContainer/pageContainer";
import toast from "react-hot-toast";
import PostForm from "../form";

const WritePost = ({ user }: { user: string }) => {
  const {
    submitLock,
    setSubmitLock,
    postTitle,
    setPostTitle,
    postContent,
    updatePostContent,
  } = useWritePostContext();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: NewPost) => {
      return fetch(`/api/post/write`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSettled: (data) => {
      if (data?.status === 201) {
        toast.success("Post created.", { duration: 4000 });
        router.push(`/${user}`);
      }
      if (data?.status === 500) {
        toast.error("Try again later.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const post: NewPost = {
      author: user,
      title: postTitle,
      content: postContent,
    };
    mutation.mutate(post);
  };

  return (
    <PageContainer>
      <div className="p-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl">Write New Post</h1>
        </div>
        <PostForm handleSubmit={handleSubmit} />
      </div>
    </PageContainer>
  );
};

export default WritePost;
