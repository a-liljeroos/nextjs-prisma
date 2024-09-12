"use client";
import React, { useState, useLayoutEffect, useRef } from "react";
// context
import { useWritePostContext } from "./writePostContext";
import { useImageViewContext } from "@components/imagePreview/imagePreviewContext";
// types
import { PostContent, PostContentType } from "@types";
// icons
import { AiOutlineEye } from "react-icons/ai";
import { FiLock } from "react-icons/fi";
import { FiUnlock } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
// components
import Image from "next/image";
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
  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [textareaRef]);

  const DynamicFields = ({ postContent }: { postContent: PostContent[] }) => {
    return [...postContent].map((contents, index) => {
      const {
        type: inputType,
        content,
        index: postIndex,
        description,
      } = contents;
      if (postIndex !== 0) {
        return (
          <DynamicInput
            key={content + index}
            index={postIndex}
            inputType={inputType}
            content={content}
            description={description}
          />
        );
      }
    });
  };

  const AddFieldButton = ({ type }: { type: PostContentType }) => {
    return (
      <button
        type="button"
        className="px-1"
        onClick={() => {
          addContentField(type);
        }}
      >
        + {type}
      </button>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 relative"
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
          <AddFieldButton type="Subheader" />
          <AddFieldButton type="Paragraph" />
          <AddFieldButton type="Image" />
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
  inputType: PostContentType;
  content: string;
  description?: string;
};

interface MoveButtonsProps {
  index: number;
}

const DynamicInput = ({
  index,
  inputType,
  content,
  description,
}: DynamicInputElement) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
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
        <div
          className="dynamic-inputs-controls bg-backgroundSecondary"
          style={{ zIndex: 20 }}
        >
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
      {inputType === "Image" && (
        <ImageInput index={index} content={content} description={description} />
      )}
      {/* <MoveButtons index={index} /> */}
    </div>
  );
};

interface ImageInputProps {
  index: number;
  content: string;
  description?: string;
}

const ImageInput = ({ index, content, description }: ImageInputProps) => {
  const { updatePostContent, postContent } = useWritePostContext();
  const { setImage } = useImageViewContext();

  const showPreview = (
    e:
      | React.TouchEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setImage(content);
  };

  return (
    <div
      className="flex flex-col gap-2 items-center py-2 pl-2 relative"
      style={{ background: "#d4d4d4", borderRadius: 5 }}
    >
      <div className="flex items-center w-full">
        <input
          hidden
          accept=".png,.jpg,.jpeg,.webp,image/png"
          type="file"
          name={"image_" + index}
          id={"image_" + index}
          onChange={(e) => {
            updatePostContent({
              index: Number(index),
              type: "Image",
              content: URL.createObjectURL(e.target.files![0]),
              description: description,
            });
          }}
        />
        <label
          className="file-upload-btn"
          style={{ lineHeight: 2.2, marginTop: 2, zIndex: 10 }}
          role="button"
          htmlFor={"image_" + index}
        >
          Select
        </label>
      </div>
      {content && (
        <div className="flex items-center w-full">
          <button
            onMouseDown={showPreview}
            onMouseUp={(e) => {
              e.preventDefault();
              setImage("");
            }}
            onMouseLeave={(e) => {
              e.preventDefault();
              setImage("");
            }}
            onTouchStart={showPreview}
            onTouchEnd={(e) => {
              e.preventDefault();
              setImage("");
            }}
            type="button"
            className={`z-20 `}
            id="write-post-image-preview-btn"
          >
            <AiOutlineEye size={30} color="white" />
          </button>
          <input
            name={"imageDescription_" + index}
            className="w-10/12 shadow-lg"
            id="write-post-image-description"
            type="text"
            placeholder="Image Description"
            defaultValue={description}
            style={{ zIndex: 10 }}
            onBlur={(e) => {
              updatePostContent({
                index: Number(index),
                type: "Image",
                content: content,
                description: e.target.value,
              });
            }}
          />
        </div>
      )}
      {content && (
        <Image
          quality={10}
          src={content}
          fill={true}
          alt=""
          className="rounded mr-auto"
          style={{ objectFit: "cover", opacity: 0.7 }}
        />
      )}
    </div>
  );
};
