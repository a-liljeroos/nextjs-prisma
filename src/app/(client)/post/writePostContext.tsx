"use client";
import { createContext, ReactNode, useContext, useState } from "react";
// types
import { PostContent, PostContentType, Post } from "@types";

interface WritePostContextProps {
  addContentField: (type: PostContentType) => void;
  deletePostContent: (index: number) => void;
  hydrateForm: (post: Post) => void;
  showMoveButtons: boolean;
  setShowMoveButtons: (showMoveButtons: boolean) => void;
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
  const context = useContext(WritePostContext);
  if (!context) {
    throw new Error(
      "useWritePostContext must be used within a WritePostContextProvider"
    );
  }
  return context;
};

type WritePostContextProviderProps = {
  children: ReactNode;
};

export const WritePostContextProvider = ({
  children,
}: WritePostContextProviderProps) => {
  //
  const [submitLock, setSubmitLock] = useState(true);

  const [showMoveButtons, setShowMoveButtons] = useState(false);

  const [postTitle, setPostTitle] = useState<string>("");

  const {
    addContentField,
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
        addContentField,
        deletePostContent,
        hydrateForm,
        moveUp,
        moveDown,
        showMoveButtons,
        setShowMoveButtons,
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

  const initContent = (): PostContent[] => {
    return [
      {
        index: 0,
        type: "Paragraph",
        content: "",
      },
    ];
  };

  const [postContent, setPostContent] = useState<PostContent[]>(initContent);

  const hydratePostContent = (content: PostContent[]) => {
    const markImages = content.map((item) => {
      if (item.type === "Image") {
        return { ...item, imageUpdated: false };
      }
      return item;
    });
    const contentSorted = sortContent(markImages);
    return setPostContent(contentSorted);
  };

  const addContentField = (type: PostContentType) => {
    let newContent: PostContent = {
      index: postContent.length,
      type: type,
      content: "",
    };
    return setPostContent([...postContent, newContent]);
  };

  const updatePostContent = (content: PostContent): void => {
    const staleRemoved = [...postContent].filter((item) => {
      if (item.index !== content.index) {
        return item;
      }
    });
    const contentCombined = [...staleRemoved, content];
    const contentSorted = sortContent(contentCombined);
    return setPostContent(contentSorted);
  };

  const deletePostContent = (index: number) => {
    const staleRemoved = [...postContent].filter((item) => {
      if (item.index !== index) {
        return item;
      }
    });
    const contentSorted = sortContent(staleRemoved);
    const contentReIndexed = reIndexContent(contentSorted);
    return setPostContent(contentReIndexed);
  };

  const moveUp = (currentIndex: number) => {
    const targetIndex = currentIndex - 1;
    const prevContent = [...postContent];
    let arrangedContent = [];
    const firstParagraph = prevContent[0];
    arrangedContent = moveItemUp(prevContent.slice(1), targetIndex);
    arrangedContent = [firstParagraph, ...arrangedContent];
    arrangedContent = reIndexContent(arrangedContent);
    return setPostContent(arrangedContent);
  };

  const moveDown = (currentIndex: number) => {
    const targetIndex = currentIndex - 1;
    const prevContent = [...postContent];
    let arrangedContent = [];
    const firstParagraph = prevContent[0];
    arrangedContent = moveItemDown(prevContent.slice(1), targetIndex);
    arrangedContent = [firstParagraph, ...arrangedContent];
    arrangedContent = reIndexContent(arrangedContent);
    return setPostContent(arrangedContent);
  };

  return {
    postContent,
    hydratePostContent,
    addContentField,
    updatePostContent,
    deletePostContent,
    moveUp,
    moveDown,
  };
};

export const preparePostSubmit = (
  postContent: PostContent[]
): PostContent[] => {
  // remove empty fields
  let content = postContent.filter((item) => {
    return item.content !== "";
  });
  content = cleanPostContent(content);
  content = sortContent(content);
  content = reIndexContent(content);
  return content;
};

const cleanPostContent = (postContent: PostContent[]): PostContent[] => {
  let cleanedContent: PostContent[] = [];
  postContent.forEach((item) => {
    cleanedContent.push({
      ...item,
      content: item.content.trim(),
    });
  });
  return cleanedContent;
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
