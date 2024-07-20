"use client";
import { createContext, ReactNode, useContext, useState } from "react";
// types
import { PostContent, Post } from "@types";

interface WritePostContextProps {
  deletePostContent: (index: number) => void;
  hydrateForm: (post: Post) => void;
  moveUp: (currentIndex: number) => void;
  moveDown: (currentIndex: number) => void;
  postContent: PostContent[];
  postTitle: string;
  setPostTitle: (postTitle: string) => void;
  setSubmitLock: (submitLock: boolean) => void;
  submitLock: boolean;
  updatePostContent: (content: PostContent) => void;
}

const WritePostContext = createContext<WritePostContextProps>(
  {} as WritePostContextProps
);

export const useWritePostContext = () => {
  return useContext(WritePostContext);
};

type WritePostContextProviderProps = {
  children: ReactNode;
};

export const WritePostContextProvider = ({
  children,
}: WritePostContextProviderProps) => {
  //
  const [submitLock, setSubmitLock] = useState(true);

  const [postTitle, setPostTitle] = useState<string>("");

  const {
    deletePostContent,
    hydratePostContent,
    moveUp,
    moveDown,
    postContent,
    updatePostContent,
  } = usePostContent();

  const hydrateForm = (post: Post) => {
    setPostTitle(post.title);
    hydratePostContent(post.content);
  };

  return (
    <WritePostContext.Provider
      value={{
        deletePostContent,
        hydrateForm,
        moveUp,
        moveDown,
        postContent,
        postTitle,
        setPostTitle,
        setSubmitLock,
        submitLock,
        updatePostContent,
      }}
    >
      {children}
    </WritePostContext.Provider>
  );
};

const usePostContent = () => {
  // first paragraph is always required and cannot be deleted

  const [postContent, setPostContent] = useState<PostContent[]>([
    {
      index: 0,
      type: "Paragraph",
      content: "",
    },
  ]);

  const hydratePostContent = (content: PostContent[]) => {
    const contentSorted = sortContent(content);
    setPostContent(contentSorted);
  };

  const updatePostContent = (content: PostContent): void => {
    let staleRemoved = postContent.filter((item) => {
      if (item.index !== content.index) {
        return item;
      }
    });
    const newContents = staleRemoved.concat(cleanPostContent(content));
    const contentSorted = sortContent(newContents);
    setPostContent(contentSorted);
  };

  const deletePostContent = (index: number) => {
    const staleRemoved = postContent.filter((item) => {
      if (item.index !== index) {
        return item;
      }
    });
    const contentSorted = sortContent(staleRemoved);
    const contentReIndexed = reIndexContent(contentSorted);
    setPostContent(contentReIndexed);
  };

  const moveUp = (currentIndex: number) => {
    const targetIndex = currentIndex - 1;
    const prevContent = [...postContent];
    let arrangedContent = [];
    const firstParagraph = prevContent[0];
    arrangedContent = moveItemUp(prevContent.slice(1), targetIndex);
    arrangedContent = [firstParagraph, ...arrangedContent];
    arrangedContent = reIndexContent(arrangedContent);
    setPostContent(arrangedContent);
  };

  const moveDown = (currentIndex: number) => {
    const targetIndex = currentIndex - 1;
    const prevContent = [...postContent];
    let arrangedContent = [];
    const firstParagraph = prevContent[0];
    arrangedContent = moveItemDown(prevContent.slice(1), targetIndex);
    arrangedContent = [firstParagraph, ...arrangedContent];
    arrangedContent = reIndexContent(arrangedContent);
    setPostContent(arrangedContent);
  };

  return {
    postContent,
    hydratePostContent,
    updatePostContent,
    deletePostContent,
    moveUp,
    moveDown,
  };
};

const cleanPostContent = (postContent: PostContent): PostContent => {
  let cleanedContent = postContent.content;
  cleanedContent = cleanedContent.trim();
  return { ...postContent, content: cleanedContent };
};

const sortContent = (content: PostContent[]): PostContent[] => {
  return content.sort((a, b) => a.index - b.index);
};

const reIndexContent = (content: PostContent[]): PostContent[] => {
  return content.map((item, index) => {
    return { ...item, index: index };
  });
};

function moveItemUp<T>(array: T[], index: number): T[] {
  if (index <= 0 || index >= array.length) {
    return array;
  }
  const temp = array[index];
  array[index] = array[index - 1];
  array[index - 1] = temp;
  return array;
}

function moveItemDown<T>(array: T[], index: number): T[] {
  if (index < 0 || index >= array.length - 1) {
    return array;
  }
  const temp = array[index];
  array[index] = array[index + 1];
  array[index + 1] = temp;
  return array;
}
