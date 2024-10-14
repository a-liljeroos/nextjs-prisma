"use client";
import React, { useEffect, useRef, FormEvent, useState } from "react";
// auth
import { signOut } from "next-auth/react";
// react-query
import { useMutation } from "@tanstack/react-query";
// context
import { useEditProfileContext } from "../editProfileContext";
// components
import InputLabel from "@components/formComponents/inputLabel";
import EditProfileListItem from "./editProfileListItem";
import toast from "react-hot-toast";

const ChangeUsername = () => {
  const { formList, user } = useEditProfileContext();
  const [disableSubmit, setDisableSubmit] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [formList]);

  const mutation = useMutation({
    mutationFn: (data: { newUsername: string }) => {
      return fetch(`/api/user/profile/update/username`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSettled: (data) => {
      if (data?.status === 201) {
        toast.success("Username changed.", { duration: 4000 });
        signOut();
      }
      if (data?.status === 409) {
        toast.error("Username is already taken.");
      }
      if (data?.status === 500) {
        toast.error("Try again later.");
      }
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newUsername = formData.get("newUsername") as string;
    mutation.mutate({ newUsername: newUsername });
  };

  return (
    <EditProfileListItem indexNo={2} name="Change Username">
      <form
        action="POST"
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col gap-3"
      >
        <InputLabel name="New username" />
        <input
          name="newUsername"
          ref={inputRef}
          type="text"
          placeholder="New username"
          defaultValue={user}
          autoCorrect="off"
          minLength={6}
          maxLength={32}
        />
        <div className="flex items-center gap-2 pt-3">
          <input
            type="checkbox"
            className="w-6 h-6"
            onChange={(e) => {
              setDisableSubmit(!disableSubmit);
            }}
          />
          <p>
            <em className="text-red-400">
              note: you will need to sign in again after the change
            </em>
          </p>
        </div>
        <button
          disabled={disableSubmit}
          type="submit"
          value="change-username"
          className="mt-4 plain-button"
        >
          Change username
        </button>
      </form>
    </EditProfileListItem>
  );
};

export default ChangeUsername;
