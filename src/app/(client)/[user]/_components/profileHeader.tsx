"use client";
import React, { useState } from "react";
import Link from "next/link";
// types
import { ProfileFetch } from "@types";
// context
import {
  useImageViewContext,
  ImageViewContextProvider,
} from "@components/imagePreview/imagePreviewContext";
// components
import { Avatar, AvatarOperations } from "./avatar";

interface ProfileHeaderProps {
  profile?: ProfileFetch;
  name: string;
  isOwner: boolean;
}

const ProfileHeader = ({ profile, name, isOwner }: ProfileHeaderProps) => {
  const [avatarModal, setAvatarModal] = useState(false);
  const [blob, setBlob] = useState<string | null | undefined>(null);
  return (
    <header className="bg-gradient-to-t from-neutral-700 to-transparent h-44">
      <div className="flex p-5">
        <Avatar
          isOwner={isOwner}
          imageUrl={profile?.profile?.image}
          name={name}
          blob={blob}
          setBlob={setBlob}
          setAvatarModal={setAvatarModal}
          avatarModal={avatarModal}
        />
        <section className="profile-header-section">
          {!avatarModal ? (
            <div className="flex flex-col gap-2 fade-in">
              <h1>{name}</h1>
              {isOwner && (
                <div>
                  <Link href={`/${name}/edit`}>
                    <button className="mt-2 plain-button">Edit Profile</button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <AvatarOperations
              imageUrl={profile?.profile?.image}
              profileId={profile?.id}
              blob={blob}
              setBlob={setBlob}
              setAvatarModal={setAvatarModal}
              avatarModal={avatarModal}
            />
          )}
        </section>
      </div>
    </header>
  );
};

export default ProfileHeader;
