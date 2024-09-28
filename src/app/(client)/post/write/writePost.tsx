"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
// react-query
import { useMutation } from "@tanstack/react-query";
// types
import { Post, NewPost } from "@types";
// context
import { useWritePostContext } from "../writePostContext";
import { ImageViewContextProvider } from "@components/imagePreview/imagePreviewContext";
// functions
import { preparePostSubmit } from "../writePostContext";
// components
import { ImageView } from "@components/imagePreview/imagePreviewContext";
import PageContainer from "@components/pageContainer/pageContainer";
import toast from "react-hot-toast";
import PostForm from "../form";

const WritePost = ({ user }: { user: string }) => {
  const { postTitle, postContent } = useWritePostContext();
  const router = useRouter();

  const mainRef = useRef(null);

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      return fetch(`/api/post/write`, {
        method: "POST",
        body: data,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    const preparedContent = preparePostSubmit(postContent);
    const published = document.getElementById("published") as HTMLInputElement;
    const post: NewPost = {
      author: user,
      title: postTitle,
      content: preparedContent,
      published: published.checked || false,
    };
    formData.append("post", JSON.stringify(post));
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

  return (
    <PageContainer mainRef={mainRef}>
      <ImageViewContextProvider>
        <ImageView
          containerRef={mainRef}
          width={280}
          className="rounded-lg shadow-lg"
          style={{
            objectFit: "cover",
            zIndex: 100,
          }}
        />
        <div className="p-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl mt-4 mb-3">Write New Post</h1>
          </div>
          <PostForm handleSubmit={handleSubmit} />
        </div>
      </ImageViewContextProvider>
    </PageContainer>
  );
};

export default WritePost;
