"use client";
import React, { useEffect, useRef, FormEvent } from "react";
// react-query
import { useMutation } from "@tanstack/react-query";
// context
import { useEditProfileContext } from "../editProfileContext";
// components
import InputLabel from "@components/formComponents/inputLabel";
import EditProfileListItem from "./editProfileListItem";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmNewPasswordRef = useRef<HTMLInputElement>(null);
  const { formList } = useEditProfileContext();

  useEffect(() => {
    if (currentPasswordRef.current) {
      currentPasswordRef.current.focus();
    }
  }, [formList]);

  const mutation = useMutation({
    mutationFn: (data: {
      currentPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    }) => {
      return fetch(`/api/user/profile/update/password`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSettled: (data) => {
      if (data?.status === 201) {
        toast.success("Password updated.", { duration: 4000 });
        currentPasswordRef.current!.value = "";
        newPasswordRef.current!.value = "";
        confirmNewPasswordRef.current!.value = "";
      }
      if (data?.status === 400) {
        toast.error("Invalid input.");
      }
      if (data?.status === 500) {
        toast.error("Try again later.");
      }
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmNewPassword = formData.get("confirmNewPassword") as string;
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match.");
      return;
    }
    mutation.mutate({
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword,
    });
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
          ref={currentPasswordRef}
          name="currentPassword"
          type="password"
          placeholder="Current password"
          minLength={6}
          maxLength={32}
        />
        <InputLabel name="New password" />
        <input
          ref={newPasswordRef}
          type="password"
          name="newPassword"
          placeholder="New password"
          minLength={6}
          maxLength={32}
        />
        <InputLabel name="Confirm new password" />
        <input
          ref={confirmNewPasswordRef}
          type="password"
          name="confirmNewPassword"
          placeholder="Confirm new password"
          minLength={6}
          maxLength={32}
        />
        <button
          type="submit"
          value="change-password"
          className="mt-4 plain-button"
        >
          Change password
        </button>
      </form>
    </EditProfileListItem>
  );
};

export default ChangePassword;
