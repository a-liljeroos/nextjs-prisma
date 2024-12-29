"use client";
import type { PutBlobResult } from "@vercel/blob";
import { useState, useEffect, useRef } from "react";
// actions
import { deleteAvatar } from "@actions";
// context
import { useImageViewContext } from "@components/imagePreview/imagePreviewContext";
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
  const { setImage } = useImageViewContext();

  useEffect(() => {
    setBlob(imageUrl);
  }, [imageUrl]);

  const showPreview = (
    e:
      | React.TouchEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (e.cancelable && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!isOwner) setImage(imageUrl || "");
  };

  const hidePreview = () => {
    setImage("");
  };

  window.oncontextmenu = function (event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    return false;
  };

  return (
    <div className="relative rounded-full shadow-lg">
      <button
        type="button"
        className="profile-img-button"
        onMouseDown={showPreview}
        onMouseUp={hidePreview}
        onTouchStart={showPreview}
        onTouchEnd={hidePreview}
        onClick={(e) => {
          e.preventDefault();
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
  imageUrl: string | null | undefined;
  avatarModal: boolean;
  setAvatarModal: React.Dispatch<React.SetStateAction<boolean>>;
  profileId: number | undefined;
  blob: string | null | undefined;
  setBlob: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}

export const AvatarOperations = ({
  imageUrl,
  avatarModal,
  setAvatarModal,
  profileId,
  blob,
  setBlob,
}: AvatarOperationsProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [uploadButton, setUploadButton] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const { setImage } = useImageViewContext();

  useEffect(() => {
    if (inputFileRef.current?.files?.length) {
      setUploadButton(true);
    } else {
      setUploadButton(false);
    }
  }, [inputFileRef.current?.files, uploadButton]);

  const showPreview = (
    e:
      | React.TouchEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (e.cancelable && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    window.oncontextmenu = function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    };

    setImage(imageUrl || "");
  };

  const hidePreview = () => {
    setImage("");
  };

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
              paddingInline: 15,
              cursor: "pointer",
            }}
            role="button"
            className="file-upload-btn avatar-edit-btn plain-button"
            htmlFor="file"
          >
            Select
          </label>
          <button className="avatar-edit-btn plain-button" type="submit">
            Upload
          </button>
        </div>
        <div className="flex gap-2">
          <DeleteButton
            profileId={profileId}
            blob={blob}
            setBlob={setBlob}
            deleteModal={deleteModal}
            setDeleteModal={setDeleteModal}
          />
          {!deleteModal && (
            <button
              type="button"
              className="avatar-edit-btn select-none plain-button"
              onMouseDown={showPreview}
              onMouseUp={hidePreview}
              onTouchStart={showPreview}
              onTouchEnd={hidePreview}
            >
              Preview
            </button>
          )}
        </div>
      </form>
    </>
  );
};

const DeleteButton = ({
  profileId,
  blob,
  setBlob,
  deleteModal,
  setDeleteModal,
}: {
  profileId: number | undefined;
  blob: string | null | undefined;
  setBlob: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  deleteModal: boolean;
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setDeleteModal(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [deleteModal]);

  if (!profileId || !blob) return null;

  if (deleteModal) {
    return (
      <>
        <button
          className="avatar-edit-btn plain-button"
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
          className="avatar-edit-btn plain-button"
          type="button"
        >
          Confirm
        </button>
      </>
    );
  }
  return (
    <button
      className="avatar-edit-btn plain-button"
      onClick={() => setDeleteModal(!deleteModal)}
      type="button"
    >
      Delete
    </button>
  );
};
