"use client";
import React from "react";
import { useRouter } from "next/navigation";
// icons
import { RxCaretLeft } from "react-icons/rx";

const GoBackButton = () => {
  const router = useRouter();
  return (
    <div
      role="button"
      className="cursor-pointer border-4 border-neutral-500 rounded-full hover:border-backgroundSecondary transition"
      onClick={() => {
        router.back();
      }}
    >
      <RxCaretLeft size={25} color="rgb(248, 248, 248)" />
    </div>
  );
};

export default GoBackButton;
