"use client";
import React, { useState, useEffect, useRef } from "react";
// context
import { useWritePostContext } from "./writePostContext";
// types
import { PostContent } from "@types";
// icons
import { FiLock } from "react-icons/fi";
import { FiUnlock } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
// styles
import "./form.scss";

interface PostFormProps {
  handleSubmit: (e: React.FormEvent) => void;
}

const PostForm = ({ handleSubmit }: PostFormProps) => {
  const {
    addContentField,
    submitLock,
    setSubmitLock,
    postTitle,
    setPostTitle,
    postContent,
    updatePostContent,
  } = useWritePostContext();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [textareaRef]);

  const DynamicFields = ({ postContent }: { postContent: PostContent[] }) => {
    return [...postContent].map((contents, index) => {
      const { type: inputType, content, index: postIndex } = contents;
      if (postIndex !== 0) {
        return (
          <DynamicInput
            key={content + index}
            index={postIndex}
            inputType={inputType}
            content={content}
          />
        );
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 "
      action="POST"
    >
      <input
        required
        type="text"
        placeholder="Post Title"
        name="title"
        defaultValue={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
      />
      <textarea
        id="0"
        ref={textareaRef}
        required
        name="paragraph"
        className="paragraph-input"
        placeholder="Paragraph"
        spellCheck="false"
        defaultValue={postContent[0].content}
        onBlur={(e) => {
          updatePostContent({
            index: 0,
            type: "Paragraph",
            content: e.target.value,
          });
        }}
      />
      <DynamicFields postContent={postContent} />
      <div className="controls flex flex-col gap-3">
        <div className="flex gap-2 ">
          <button
            type="button"
            className="px-1"
            onClick={() => {
              addContentField("Subheader");
            }}
          >
            + Subheader
          </button>
          <button
            type="button"
            className="px-1"
            onClick={() => {
              addContentField("Paragraph");
            }}
          >
            + Paragraph
          </button>
          {/*   <button type="button" className="px-1">
        + Image
      </button> */}
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button type="submit" disabled={submitLock}>
          Save
        </button>
        <button type="button">Preview</button>
        <button type="button" onClick={() => setSubmitLock(!submitLock)}>
          {submitLock ? (
            <FiLock color="white" size={25} />
          ) : (
            <FiUnlock color="white" size={25} />
          )}
        </button>
      </div>
    </form>
  );
};

export default PostForm;

type DynamicInputElement = {
  index: number;
  inputType: "Subheader" | "Paragraph";
  content: string;
};

interface MoveButtonsProps {
  index: number;
}

const DynamicInput = ({ index, inputType, content }: DynamicInputElement) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, []);

  const { deletePostContent, updatePostContent, postContent } =
    useWritePostContext();
  const [showControls, setShowControls] = useState(false);
  const [inputValue, setInputValue] = useState<string>(content || "");

  const deleteInputField = () => {
    setShowControls(!showControls);
    deletePostContent(index);
  };

  const MoveButtons = ({ index }: MoveButtonsProps) => {
    const { moveUp, moveDown } = useWritePostContext();
    return (
      <>
        <button
          type="button"
          onClick={() => {
            moveUp(index);
          }}
        >
          up
        </button>
        <button type="button" onClick={() => moveDown(index)}>
          down
        </button>
      </>
    );
  };

  return (
    <div className="dynamic-inputs">
      {showControls && (
        <div className="dynamic-inputs-controls bg-backgroundSecondary">
          <button type="button" onClick={deleteInputField}>
            Delete
          </button>
        </div>
      )}
      <button
        id="setControlsBtn"
        type="button"
        style={{ borderBottom: "initial" }}
        onClick={() => setShowControls(!showControls)}
      >
        <BsThreeDotsVertical color="black" size={20} />
      </button>

      {inputType === "Subheader" && (
        <>
          <input
            name={"subheader_" + index}
            className="dynamic-input"
            type="text"
            placeholder="Subheader"
            defaultValue={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => {
              setShowControls(false);
            }}
            onBlur={(e) =>
              updatePostContent({
                index: Number(index),
                type: inputType,
                content: e.target.value,
              })
            }
          />
        </>
      )}
      {inputType === "Paragraph" && (
        <>
          <textarea
            ref={textareaRef}
            name={"paragraph_" + index}
            className="paragraph-input dynamic-input"
            placeholder="Paragraph"
            spellCheck="false"
            defaultValue={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            onFocus={() => {
              setShowControls(false);
            }}
            onBlur={(e) =>
              updatePostContent({
                index: Number(index),
                type: inputType,
                content: inputValue,
              })
            }
          />
        </>
      )}
      {/* <MoveButtons index={index} /> */}
    </div>
  );
};
