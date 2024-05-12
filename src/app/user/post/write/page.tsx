"use client";
import React, { useState, useEffect } from "react";
// types
import { InputType } from "./writePostContext";
// context
import {
  WritePostContextProvider,
  useWritePostContext,
} from "./writePostContext";
// functions
import { randomId } from "@functions";
// components
import PageContainer from "@components/pageContainer/pageContainer";
// icons
import { FiLock } from "react-icons/fi";
import { FiUnlock } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
// styles
import "./write.scss";

export default function Page() {
  return (
    <WritePostContextProvider>
      <WritePost />
    </WritePostContextProvider>
  );
}

const WritePost = () => {
  const {
    submitLock,
    setSubmitLock,
    extraInputFields,
    setExtraInputFields,
    postContent,
    updatePostContent,
  } = useWritePostContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl">Write New Post</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 "
        action="POST"
      >
        <input
          id="0"
          required
          type="text"
          placeholder="Post Header"
          name="header"
          onBlur={(e) => {
            updatePostContent({
              index: 0,
              type: "Header",
              content: e.target.value,
            });
          }}
        />
        <textarea
          id="1"
          required
          name="paragraph"
          className="paragraph-input"
          placeholder="Paragraph"
          spellCheck="false"
          onBlur={(e) => {
            updatePostContent({
              index: 1,
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
              orderNo={(index + 2).toString()}
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
      <pre className="mt-6">{JSON.stringify(postContent, null, 2)}</pre>
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
        <div className="extra-inputs-controls">
          <button type="button" onClick={deleteInputField}>
            Delete
          </button>
        </div>
      )}
      <button
        id="setControlsBtn"
        type="button"
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
