"use client";
import React, { ElementRef, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { revalidatePost, redirectToPost } from "@actions";
// react-query
import { useMutation } from "@tanstack/react-query";
// types
import { Post } from "@types";
// context
import { useWritePostContext } from "../../writePostContext";
import { ImageViewContextProvider } from "@components/imagePreview/imagePreviewContext";
// functions
import { preparePostSubmit } from "../../writePostContext";
// components
import PageContainer from "@components/pageContainer/pageContainer";
import PostForm from "../../form";
import toast from "react-hot-toast";
import { ImageView } from "@components/imagePreview/imagePreviewContext";

interface EditPostProps {
  user: string;
  post: Post;
}

const EditPost = ({ user, post }: EditPostProps) => {
  const mainRef = useRef<ElementRef<"main">>(null);

  return (
    <PageContainer mainRef={mainRef}>
      <ImageViewContextProvider>
        <ImageView
          containerRef={mainRef}
          width={250}
          className="rounded-lg shadow-lg"
          style={{
            objectFit: "cover",
            zIndex: 100,
          }}
        />
        <div className="p-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl mt-4 mb-3">Edit Post</h1>
          </div>
          <EditPostForm post={post} user={user} />
        </div>
      </ImageViewContextProvider>
    </PageContainer>
  );
};

interface EditPostFormProps {
  post: Post;
  user: string;
}

const EditPostForm = ({ post, user }: EditPostFormProps) => {
  const { hydrateForm, postTitle, postContent } = useWritePostContext();

  useEffect(() => {
    hydrateForm(post);
  }, [post]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      return fetch(`/api/post/edit/${post.id}`, {
        method: "PUT",
        body: data,
      });
    },
    onSettled: (data) => {
      if (data?.status === 201) {
        toast.success("Post updated.", { duration: 4000 });
        postContent.map((content) => {
          if (content.type === "Image") {
            URL.revokeObjectURL(content.content);
          }
        });
        revalidatePost(`/${user}/${post.id}`);
        redirectToPost(`/${user}/${post.id}`);
      }
      if (data?.status === 500) {
        toast.error("Try again later.");
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    const preparedContent = preparePostSubmit(postContent);
    const editedPost: Post = {
      ...post,
      author: user,
      title: postTitle,
      content: preparedContent,
    };
    formData.append("post", JSON.stringify(editedPost));
    const newImages: number[] = [];
    preparedContent.map((content) => {
      if (
        content.type === "Image" &&
        content.imageUpdated === undefined &&
        content.content
      ) {
        newImages.push(content.index);
      }
    });
    formData.append("newImages", JSON.stringify(newImages));
    await Promise.all(
      postContent.map(async (content) => {
        if (content.type === "Image" && newImages.includes(content.index)) {
          const image = await fetch(content.content).then((r) => r.blob());
          formData.append(content.index.toString(), image);
        }
      })
    );
    mutation.mutate(formData);
  };

  return <PostForm handleSubmit={handleSubmit} />;
};

export default EditPost;
