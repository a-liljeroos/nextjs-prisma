"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// react-query
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPost } from "@crudFunctions";
// types
import { Post } from "@types";
// context
import { useWritePostContext } from "../../writePostContext";
// components
import PageContainer from "@components/pageContainer/pageContainer";
import toast from "react-hot-toast";
import PostForm from "../../form";

interface EditPostProps {
  user: string;
  postId: number;
  post?: Post;
}

const EditPost = ({ postId, user }: EditPostProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPost(postId),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  /*   if (isError) {
    router.push("/");
  } */

  return (
    <PageContainer>
      <div className="p-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl">Edit Post</h1>
        </div>
        <EditPostForm post={data} user={user} />
      </div>
    </PageContainer>
  );
};

interface EditPostFormProps {
  post: Post | undefined;
  user: string;
}

const EditPostForm = ({ post, user }: EditPostFormProps) => {
  const { hydrateForm, postTitle, postContent } = useWritePostContext();
  const router = useRouter();

  useEffect(() => {
    if (post) {
      hydrateForm(post);
    }
  }, []);

  if (!post) {
    return <div>Post not found</div>;
  }

  const mutation = useMutation({
    mutationFn: (data: Post) => {
      return fetch(`/api/post/edit/${post.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSettled: (data) => {
      if (data?.status === 201) {
        toast.success("Post updated.", { duration: 4000 });
        router.push(`/post/${post.id}`);
      }
      if (data?.status === 500) {
        toast.error("Try again later.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPost: Post = {
      ...post,
      author: user,
      title: postTitle,
      content: postContent,
    };
    mutation.mutate(updatedPost);
  };

  return <PostForm handleSubmit={handleSubmit} />;
};

export default EditPost;
