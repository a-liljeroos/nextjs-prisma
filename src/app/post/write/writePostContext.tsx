"use client";
import { createContext, ReactNode, useContext, useState } from "react";
// types
import { PostContent } from "@types";

export type InputType = { type: "Subheader" | "Paragraph"; inputId: string };

interface WritePostContextProps {
  submitLock: boolean;
  setSubmitLock: (submitLock: boolean) => void;
  extraInputFields: InputType[];
  setExtraInputFields: (extraInputFields: InputType[]) => void;
  newInputIndex?: () => number;
  removeExtraInputField: (inputId: string) => void;
  moveItem: (item: InputType, direction: "up" | "down") => void;
  postTitle: string;
  setPostTitle: (postTitle: string) => void;
  postContent: PostContent[];
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
  const [postTitle, setPostTitle] = useState<string>("");
  const [postContent, setPostContent] = useState<PostContent[]>([
    {
      index: 0,
      type: "Paragraph",
      content: "",
    },
  ]);

  const updatePostContent = (content: PostContent) => {
    const staleRemoved = postContent.filter((item) => {
      if (item.index !== content.index) {
        return item;
      }
    });
    const contentSorted = [...staleRemoved, cleanPostContent(content)].sort(
      (a, b) => a.index - b.index
    );
    setPostContent(contentSorted);
  };

  const [submitLock, setSubmitLock] = useState(true);

  const [extraInputFields, setExtraInputFields] = useState<InputType[]>([]);

  const removeExtraInputField = (inputId: string) => {
    const newExtraInputFields = extraInputFields.filter((inputField) => {
      if (inputField.inputId !== inputId) {
        return inputField;
      }
    });
    setExtraInputFields(newExtraInputFields);

    const remainingPostContent = postContent.filter((item) => {
      if (item.inputId !== inputId) {
        return item;
      }
    });
    setPostContent(remainingPostContent);
  };

  const moveItem = (item: InputType, direction: "up" | "down") => {
    /* let items = [...extraInputFields];
    const currentIndex = items.indexOf(item);
    const temp = items[currentIndex];
    if (direction === "up" && currentIndex < items.length - 1) {
      items[currentIndex] = items[currentIndex + 1];
      items[currentIndex + 1] = temp;
    }
    if (direction === "down" && currentIndex >= 3) {
      items[currentIndex] = items[currentIndex - 1];
      items[currentIndex - 1] = temp;
    }
    setExtraInputFields(items); */
  };

  return (
    <WritePostContext.Provider
      value={{
        submitLock,
        setSubmitLock,
        extraInputFields,
        setExtraInputFields,
        removeExtraInputField,
        moveItem,
        postTitle,
        setPostTitle,
        postContent,
        updatePostContent,
      }}
    >
      {children}
    </WritePostContext.Provider>
  );
};

const cleanPostContent = (postContent: PostContent): PostContent => {
  let cleanedContent = postContent.content;

  cleanedContent = cleanedContent.trim();

  return { ...postContent, content: cleanedContent };
};
