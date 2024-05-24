"use client";
import React, { useEffect, useRef, FormEvent } from "react";
// context
import { useEditProfileContext } from "../editProfileContext";
// components
import InputLabel from "@components/formComponents/inputLabel";
import EditProfileListItem from "./editProfileListItem";

const ChangePassword = () => {
  const firstInputRef = useRef<HTMLInputElement>(null);
  const { formList } = useEditProfileContext();
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [formList]);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };
  return (
    <EditProfileListItem name="Change password" indexNo={1}>
      <form
        action="POST"
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col gap-3"
      >
        <InputLabel name="Current password" />
        <input
          ref={firstInputRef}
          type="password"
          placeholder="Current password"
        />
        <InputLabel name="New password" />
        <input type="password" placeholder="New password" />
        <InputLabel name="Confirm new password" />
        <input type="password" placeholder="Confirm new password" />
        <button type="submit" value="change-password" className="mt-4">
          Change password
        </button>
      </form>
    </EditProfileListItem>
  );
};

export default ChangePassword;
