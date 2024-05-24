"use client";
import React, { useState, useEffect } from "react";
// react-query
import { useMutation } from "@tanstack/react-query";
// types
import { InputType } from "./writePostContext";
import { Post } from "@types";
// context
import { useWritePostContext } from "./writePostContext";
// functions
import { randomId } from "@functions";
// components
import PageContainer from "@components/pageContainer/pageContainer";
import toast from "react-hot-toast";
// icons
import { FiLock } from "react-icons/fi";
import { FiUnlock } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
// styles
import "./write.scss";

const WritePost = ({ user }: { user: string }) => {
  const {
    submitLock,
    setSubmitLock,
    extraInputFields,
    setExtraInputFields,
    postTitle,
    setPostTitle,
    postContent,
    updatePostContent,
  } = useWritePostContext();

  const mutation = useMutation({
    mutationFn: (data: Post) => {
      return fetch(`/api/post/write`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSettled: (data) => {
      if (data?.status === 201) {
        toast.success("Post created.", { duration: 4000 });
        window.location.href = `/${user}`;
      }
      if (data?.status === 500) {
        toast.error("Try again later.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const post: Post = {
      author: user,
      title: postTitle,
      content: postContent,
    };
    mutation.mutate(post);
  };

  return (
    <PageContainer>
      <div className="p-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl">Write New Post</h1>
        </div>
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
            onChange={(e) => setPostTitle(e.target.value)}
          />
          <textarea
            id="0"
            required
            name="paragraph"
            className="paragraph-input"
            placeholder="Paragraph"
            spellCheck="false"
            onBlur={(e) => {
              updatePostContent({
                index: 0,
                type: "Paragraph",
                content: e.target.value,
              });
            }}
          />
          {extraInputFields.map((inputField, index) => {
            return (
              <AddInput
                key={index}
                inputField={inputField}
                orderNo={(index + 1).toString()}
              />
            );
          })}
          <div className="controls flex flex-col gap-3">
            <div className="flex gap-2 ">
              <button
                type="button"
                className="px-1"
                onClick={() => {
                  const inputId = randomId();
                  setExtraInputFields([
                    ...extraInputFields,
                    { type: "Subheader", inputId: inputId },
                  ]);
                }}
              >
                + Subheader
              </button>
              <button
                type="button"
                className="px-1"
                onClick={() => {
                  const inputId = randomId();
                  setExtraInputFields([
                    ...extraInputFields,
                    { type: "Paragraph", inputId: inputId },
                  ]);
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
      </div>
    </PageContainer>
  );
};

type AddInputElement = {
  inputField: InputType;
  orderNo: string;
};

const AddInput = ({ inputField, orderNo }: AddInputElement) => {
  const { removeExtraInputField, postContent, updatePostContent, moveItem } =
    useWritePostContext();
  const [showControls, setShowControls] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { type: inputType, inputId } = inputField;

  useEffect(() => {
    updatePostContent({
      index: Number(orderNo),
      type: inputType,
      content: inputValue,
      inputId: inputId,
    });
  }, [inputValue]);

  const deleteInputField = () => {
    setShowControls(!showControls);
    removeExtraInputField(inputId);
  };

  /* const MoveButtons = () => {
    return (
      <>
        <button role="button" onClick={() => moveItem(inputField, "up")}>
          up
        </button>
        <button role="button" onClick={() => moveItem(inputField, "down")}>
          down
        </button>
      </>
    );
  }; */

  return (
    <div id={inputId} className="extra-inputs">
      {showControls && (
        <div className="extra-inputs-controls bg-backgroundSecondary">
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
            id={orderNo}
            name={"subheader_" + inputId}
            className="extra-input"
            type="text"
            placeholder="Subheader"
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => {
              setShowControls(false);
            }}
          />
          {/* <MoveButtons /> */}
        </>
      )}
      {inputType === "Paragraph" && (
        <>
          <textarea
            id={orderNo}
            name={"paragraph_" + inputId}
            className="paragraph-input extra-input"
            placeholder="Paragraph"
            spellCheck="false"
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => {
              setShowControls(false);
            }}
          />
          {/* <MoveButtons /> */}
        </>
      )}
    </div>
  );
};

export default WritePost;
