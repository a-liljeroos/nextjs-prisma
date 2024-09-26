"use client";
import type { PutBlobResult } from "@vercel/blob";
import { useState, useEffect, useRef } from "react";
// actions
import { deleteAvatar } from "@actions";
// components
import Image from "next/image";
import toast from "react-hot-toast";
// icons
import { IoCaretBackOutline } from "react-icons/io5";

interface AvatarProps {
  isOwner: boolean;
  imageUrl: string | null | undefined;
  name: string;
  blob: string | null | undefined;
  setBlob: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  avatarModal: boolean;
  setAvatarModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Avatar = ({
  isOwner,
  imageUrl,
  name,
  blob,
  setBlob,
  avatarModal,
  setAvatarModal,
}: AvatarProps) => {
  useEffect(() => {
    setBlob(imageUrl);
  }, [imageUrl]);

  return (
    <div className="relative">
      <button
        className="profile-img-button"
        onClick={() => {
          if (isOwner) setAvatarModal(!avatarModal);
        }}
        style={{ borderBottom: "initial" }}
      >
        {blob && (
          <Image
            className="profile-avatar"
            priority
            src={blob}
            alt={`Avatar for ${name}`}
            width={120}
            height={120}
          />
        )}
      </button>
    </div>
  );
};

interface AvatarOperationsProps {
  avatarModal: boolean;
  setAvatarModal: React.Dispatch<React.SetStateAction<boolean>>;
  profileId: number | undefined;
  blob: string | null | undefined;
  setBlob: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}

export const AvatarOperations = ({
  avatarModal,
  setAvatarModal,
  profileId,
  blob,
  setBlob,
}: AvatarOperationsProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [uploadButton, setUploadButton] = useState(false);

  useEffect(() => {
    if (inputFileRef.current?.files?.length) {
      setUploadButton(true);
    } else {
      setUploadButton(false);
    }
  }, [inputFileRef.current?.files, uploadButton]);

  return (
    <>
      <form
        className="flex flex-col gap-2 fade-in"
        onSubmit={async (event) => {
          event.preventDefault();

          if (!inputFileRef.current?.files) {
            throw new Error("No file selected");
          }

          const file = inputFileRef.current.files[0];

          const response = await fetch(
            `/api/user/avatar/upload?filename=${file.name}`,
            {
              cache: "no-cache",
              method: "POST",
              body: file,
            }
          );

          if (!response.ok) {
            toast.error("Failed to upload file");
            throw new Error("Failed to upload file");
          }

          const newBlob = (await response.json()) as PutBlobResult;
          const url = newBlob.url;

          setBlob(url);
          setAvatarModal(!avatarModal);
        }}
      >
        <div className="flex items-center gap-2">
          <div role="button">
            <IoCaretBackOutline
              className="cursor-pointer pt-1"
              size={25}
              color="white"
              onClick={() => {
                setAvatarModal(!avatarModal);
              }}
            />
          </div>
          <h1>Edit Avatar</h1>
        </div>
        <div className="flex items-center justify-center gap-2 pt-2">
          <input
            hidden
            name="file"
            id="file"
            ref={inputFileRef}
            type="file"
            accept=".png,.jpg,.jpeg,.webp,image/png"
            required
          />
          <label
            style={{
              lineHeight: 2.2,
              paddingInline: 20,
              cursor: "pointer",
            }}
            role="button"
            className="file-upload-btn w-24"
            htmlFor="file"
          >
            Select
          </label>
          <button className="w-24" type="submit">
            Upload
          </button>
        </div>
        <DeleteButton profileId={profileId} blob={blob} setBlob={setBlob} />
      </form>
    </>
  );
};

const DeleteButton = ({
  profileId,
  blob,
  setBlob,
}: {
  profileId: number | undefined;
  blob: string | null | undefined;
  setBlob: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}) => {
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDeleteModal(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [deleteModal]);

  if (!profileId || !blob) return null;

  if (deleteModal) {
    return (
      <div className="flex gap-2">
        <button
          className="w-24"
          type="button"
          onClick={() => {
            setDeleteModal(false);
          }}
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            if (await deleteAvatar(profileId)) {
              setBlob(null);
              toast.success("Avatar deleted");
            } else {
              toast.error("Failed to delete avatar");
            }
            setDeleteModal(false);
          }}
          className="w-24"
          type="button"
        >
          Confirm
        </button>
      </div>
    );
  }
  return (
    <button
      className="w-24"
      onClick={() => setDeleteModal(!deleteModal)}
      type="button"
    >
      Delete
    </button>
  );
};
