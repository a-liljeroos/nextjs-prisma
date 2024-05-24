"use client";
import React, { useEffect, useRef, FormEvent } from "react";
// context
import { useEditProfileContext } from "../editProfileContext";
// components
import EditProfileListItem from "./editProfileListItem";

const ChangeBio = () => {
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const { formList } = useEditProfileContext();
  useEffect(() => {
    if (bioRef.current) {
      bioRef.current.focus();
    }
  }, [formList]);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <EditProfileListItem name="Write bio" indexNo={0}>
      <form
        action="POST"
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col gap-3"
      >
        <textarea
          ref={bioRef}
          className="max-h-96 min-h-36"
          placeholder="Write something about yourself..."
        />
        <button type="submit" value="Change bio" className="mt-2">
          Update
        </button>
      </form>
    </EditProfileListItem>
  );
};

export default ChangeBio;
