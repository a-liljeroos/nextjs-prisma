"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { revalidatePost, redirectToPost } from "./actions";
// react-query
import { useMutation } from "@tanstack/react-query";
// types
import { Post } from "@types";
// context
import { useWritePostContext } from "../../writePostContext";
// components
import PageContainer from "@components/pageContainer/pageContainer";
import PostForm from "../../form";
import toast from "react-hot-toast";

interface EditPostProps {
  user: string;
  post: Post;
}

const EditPost = ({ user, post }: EditPostProps) => {
  return (
    <PageContainer>
      <div className="p-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl">Edit Post</h1>
        </div>
        <EditPostForm post={post} user={user} />
      </div>
    </PageContainer>
  );
};

interface EditPostFormProps {
  post: Post;
  user: string;
}

const EditPostForm = ({ post, user }: EditPostFormProps) => {
  const { hydrateForm, postTitle, postContent } = useWritePostContext();
  const router = useRouter();

  useEffect(() => {
    if (post) {
      hydrateForm(post);
    }
  }, [post]);

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
        revalidatePost(`/${user}/${post.id}`);
        redirectToPost(`/${user}/${post.id}`);
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
