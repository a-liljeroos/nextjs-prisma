"use client";
import React, { useEffect, useRef, FormEvent } from "react";
// context
import { useEditProfileContext } from "../editProfileContext";
// components
import InputLabel from "@components/formComponents/inputLabel";
import EditProfileListItem from "./editProfileListItem";

const ChangeUsername = () => {
  const { formList, userData } = useEditProfileContext();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [formList]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  const name = userData ? userData.name : "";

  return (
    <EditProfileListItem indexNo={2} name="Change Username">
      <form
        action="POST"
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col gap-3"
      >
        <InputLabel name="New username" />
        <input
          ref={inputRef}
          type="text"
          placeholder="New username"
          defaultValue={name}
          autoCorrect="off"
        />
        <button type="submit" value="change-username" className="mt-4">
          Change username
        </button>
      </form>
    </EditProfileListItem>
  );
};

export default ChangeUsername;
