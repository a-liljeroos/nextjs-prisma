"use client";
import React, { useEffect, useRef, FormEvent } from "react";
// react-query
import { useMutation } from "@tanstack/react-query";
import useGetProfile from "../../_fetchProfile/useGetProfile";
// context
import { useEditProfileContext } from "../editProfileContext";
// components
import EditProfileListItem from "./editProfileListItem";
import toast from "react-hot-toast";

const ChangeBio = () => {
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const { formList, userData, user } = useEditProfileContext();
  const { refetch } = useGetProfile(user);
  const bio = userData ? userData.profile?.bio : "";
  const userId = userData ? userData.id : null;

  const mutation = useMutation({
    mutationFn: (data: { bio: string; id: number | null }) => {
      return fetch(`/api/user/profile/update/bio`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSettled: (data) => {
      if (data?.status === 201) {
        toast.success("Bio updated.", { duration: 4000 });
        refetch();
      }
      if (data?.status === 500) {
        toast.error("Try again later.");
      }
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const bio = formData.get("bio") as string;

    mutation.mutate({ bio: bio, id: userId });
  };

  useEffect(() => {
    if (bioRef.current) {
      bioRef.current.focus();
    }
  }, [formList]);

  return (
    <EditProfileListItem name="Write bio" indexNo={0}>
      <form
        action="POST"
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col gap-3"
      >
        <textarea
          name="bio"
          ref={bioRef}
          defaultValue={bio ? bio : ""}
          maxLength={76}
          className="max-h-36 min-h-36"
          placeholder="Write something about yourself..."
          autoCorrect="off"
        />
        <button type="submit" value="Change bio" className="mt-2">
          Update
        </button>
      </form>
    </EditProfileListItem>
  );
};

export default ChangeBio;
