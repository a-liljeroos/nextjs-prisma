"use client";
import React, { useState, useLayoutEffect, useRef } from "react";
// context
import { useWritePostContext } from "./writePostContext";
import { useImageViewContext } from "@components/imagePreview/imagePreviewContext";
// types
import { PostContent, PostContentType } from "@types";
// icons
import { AiOutlineEye } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";
// components
import Image from "next/image";
import FormButtons from "./formButtons";
// styles
import "./form.scss";

interface PostFormProps {
  handleSubmit: (e: React.FormEvent) => void;
  published?: boolean;
}

const PostForm = ({ handleSubmit, published }: PostFormProps) => {
  const { postTitle, setPostTitle, postContent, updatePostContent } =
    useWritePostContext();

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
      <FormButtons published={published} />
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

  const { deletePostContent, updatePostContent, postContent, showMoveButtons } =
    useWritePostContext();
  const [showControls, setShowControls] = useState(false);

  const deleteInputField = () => {
    setShowControls(!showControls);
    deletePostContent(index);
  };

  interface MoveButtonsProps {
    index: number;
    totalInputs: number;
    children?: React.ReactNode;
  }

  const MoveButtons = ({ index, totalInputs, children }: MoveButtonsProps) => {
    const { moveUp, moveDown, showMoveButtons } = useWritePostContext();
    const notFirst = index !== 1;
    const notLast = index !== totalInputs - 1;

    return (
      <div className="flex flex-col w-full">
        {showMoveButtons && (
          <div
            role="button"
            className={`bg-white w-1/4 rounded-t-xl flex justify-center -mb-1  ${
              notFirst ? "" : "opacity-0 user-select-none cursor-default"
            }`}
            onClick={() => {
              moveUp(index);
            }}
          >
            <TiArrowSortedUp size={22} color="#3D3D3D" />
          </div>
        )}
        {children}
        {showMoveButtons && (
          <div
            role="button"
            className={`bg-white w-1/4 ml-auto rounded-b-xl flex justify-center -mt-1 ${
              notLast ? "" : "opacity-0 user-select-none cursor-default"
            }`}
            onClick={() => moveDown(index)}
          >
            <TiArrowSortedDown size={22} color="#3D3D3D" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`dynamic-inputs flex rounded" ${showMoveButtons && "-mt-5"} `}
    >
      <MoveButtons index={index} totalInputs={postContent.length}>
        <div className="flex w-full relative">
          {showControls && (
            <div
              className="dynamic-inputs-controls bg-backgroundSecondary"
              style={{ zIndex: 20 }}
            >
              <button
                className="plain-button"
                type="button"
                onClick={deleteInputField}
              >
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
            <input
              name={"subheader_" + index}
              className="dynamic-input w-full"
              type="text"
              placeholder="Subheader"
              defaultValue={content || ""}
              onFocus={() => {
                if (showControls) setShowControls(false);
              }}
              onBlur={(e) =>
                updatePostContent({
                  index: Number(index),
                  type: inputType,
                  content: e.target.value,
                })
              }
            />
          )}
          {inputType === "Paragraph" && (
            <textarea
              ref={textareaRef}
              name={"paragraph_" + index}
              className="paragraph-input dynamic-input w-full"
              placeholder="Paragraph"
              spellCheck="false"
              defaultValue={content || ""}
              onFocus={() => {
                if (showControls) setShowControls(false);
              }}
              onBlur={(e) =>
                updatePostContent({
                  index: Number(index),
                  type: inputType,
                  content: e.target.value,
                })
              }
            />
          )}
          {inputType === "Image" && (
            <ImageInput
              index={index}
              content={content}
              description={description}
            />
          )}
        </div>
      </MoveButtons>
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
    if (e.cancelable && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    setImage(content);
  };

  window.oncontextmenu = function (event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    return false;
  };

  return (
    <div
      className="flex flex-col gap-2 items-center py-2 pl-2 relative w-full"
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
            onMouseUp={() => {
              setImage("");
            }}
            onMouseLeave={() => {
              setImage("");
            }}
            onTouchStart={showPreview}
            onTouchEnd={() => {
              setImage("");
            }}
            type="button"
            className={`z-20 plain-button`}
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
