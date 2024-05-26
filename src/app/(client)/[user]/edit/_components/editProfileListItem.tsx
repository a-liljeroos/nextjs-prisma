"use client";
import { useState } from "react";
import { useEditProfileContext } from "../editProfileContext";
// icons
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";

interface EditProfileListItemProps {
  children: React.ReactNode;
  name: string;
  indexNo: number;
}

const EditProfileListItem = ({
  children,
  name,
  indexNo,
}: EditProfileListItemProps) => {
  const { toggleForms, formList } = useEditProfileContext();
  const openState = formList[indexNo].open;

  return (
    <div className="flex flex-col rounded-lg bg-neutral-700 shadow-md">
      <div
        onClick={() => {
          toggleForms(indexNo);
        }}
        className={
          "flex items-center gap-1 p-2 cursor-pointer " +
          (!openState ? "rounded-lg" : " bg-backgroundSecondary rounded-t-lg")
        }
      >
        <button
          type="button"
          className="bg-transparent hover:bg-transparent border-none hover:border-none grid place-items-center rounded-full w-2 h-8 mr-2"
          onClick={() => {
            toggleForms(indexNo);
          }}
        >
          {openState ? (
            <MdKeyboardArrowDown
              size={25}
              color={openState ? "rgb(61, 61, 61)" : "white"}
            />
          ) : (
            <MdKeyboardArrowRight size={25} color="white" />
          )}
        </button>
        <h2 className={`${openState && "font-semibold text-background"}`}>
          {name}
        </h2>
      </div>
      <div className={"overflow-hidden " + (!openState && "h-0")}>
        <div className="px-4 mt-4 mb-4">{openState && children}</div>
        {/* <div className="bg-backgroundSecondary rounded-b-lg h-4"></div> */}
      </div>
    </div>
  );
};

export default EditProfileListItem;
