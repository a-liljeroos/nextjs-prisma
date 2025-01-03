import React, { useState } from "react";
// context
import { useWritePostContext } from "./writePostContext";
// types
import { PostContentType } from "@types";
// icons
import { BsInfoCircleFill } from "react-icons/bs";
import { FiLock } from "react-icons/fi";
import { FiUnlock } from "react-icons/fi";
import { LuMove } from "react-icons/lu";

interface FormButtonsProps {
  published?: boolean;
}

const FormButtons = ({ published }: FormButtonsProps) => {
  const {
    addContentField,
    setShowMoveButtons,
    setSubmitLock,
    showMoveButtons,
    submitLock,
  } = useWritePostContext();

  const [showInfoBox, setShowInfoBox] = useState(false);

  const AddFieldButton = ({ type }: { type: PostContentType }) => {
    return (
      <button
        type="button"
        className="px-1 plain-button"
        onClick={() => {
          addContentField(type);
        }}
      >
        {type}
      </button>
    );
  };

  return (
    <>
      <div className="controls flex flex-col gap-3">
        <div className="flex flex-wrap gap-2 ">
          <AddFieldButton type="Subheader" />
          <AddFieldButton type="Paragraph" />
          <AddFieldButton type="Image" />
          <button
            type="button"
            className={`plain-button ${
              showMoveButtons ? "bg-backgroundSecondary" : ""
            }`}
            onClick={() => setShowMoveButtons(!showMoveButtons)}
          >
            <LuMove color="white" size={20} />
          </button>
          <button
            className="plain-button"
            type="button"
            onClick={() => setShowInfoBox(!showInfoBox)}
          >
            <BsInfoCircleFill
              color={showInfoBox ? "rgb(199, 201, 80)" : "white"}
              size={20}
            />
          </button>
        </div>
      </div>
      {showInfoBox && <InfoBox />}
      <div className="flex gap-2 items-center">
        <input
          className="w-4 h-4"
          name="published"
          type="checkbox"
          id="published"
          defaultChecked={published || false}
        />
        <label htmlFor="published">Published</label>
      </div>

      <div className="flex gap-2 mt-4">
        <button className="plain-button" type="submit" disabled={submitLock}>
          Save
        </button>
        <button className="plain-button" type="button">
          Preview
        </button>
        <button
          className="plain-button"
          type="button"
          onClick={() => setSubmitLock(!submitLock)}
        >
          {submitLock ? (
            <FiLock color="white" size={25} />
          ) : (
            <FiUnlock color="white" size={25} />
          )}
        </button>
      </div>
    </>
  );
};

const InfoBox = () => {
  return (
    <div className="bg-neutral-700 rounded-lg px-3 py-5">
      <h3 className="font-bold mb-2">Links</h3>
      <div className="pl-2 border-l flex flex-col gap-2 text-sm">
        <p>
          To insert links in to the text write{" "}
          <b className="text-backgroundSecondary">{"**LINK[]()"}</b> .
        </p>
        <p>
          Example:{" "}
          <b className="text-backgroundSecondary">
            {"**LINK[Your link text](https://tailwindcss.com/)"}
          </b>
        </p>
        <p>If the link text is empty the link itself is used as the text.</p>
      </div>
    </div>
  );
};

export default FormButtons;
