"use client";
import React, { useState } from "react";
import Link from "next/link";
// types
import { ProfileFetch, UserRoles } from "@types";
// context
import {
  useImageViewContext,
  ImageViewContextProvider,
} from "@components/imagePreview/imagePreviewContext";
// icons
import { FaStar } from "react-icons/fa6";
// components
import DmModal from "@components/directMessages/_components/dmModal/dmModal";
import { Avatar, AvatarOperations } from "./avatar";
import DirectMessageButton from "./directMessageButton";

interface ProfileHeaderProps {
  profile: ProfileFetch;
  name: string;
  isOwner: boolean;
}

const ProfileHeader = ({ profile, name, isOwner }: ProfileHeaderProps) => {
  const [avatarModal, setAvatarModal] = useState(false);
  const [showDmModal, setShowDmModal] = useState(false);
  const [blob, setBlob] = useState<string | null | undefined>(null);
  return (
    <header className="bg-gradient-to-t from-neutral-700 to-transparent h-44 relative">
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
              <div className="flex gap-1">
                <h1>{name}</h1>
                {profile?.role === UserRoles.ADMIN && (
                  <div>
                    <FaStar size={15} color="rgb(199, 201, 80)" />
                  </div>
                )}
              </div>
              {!isOwner && profile?.id && (
                <div className="flex gap-2 border-l-2 border-neutral-300/20 px-3 my-1 fade-in">
                  <DirectMessageButton
                    setShowDmModal={setShowDmModal}
                    showDmModal={showDmModal}
                    profileId={profile.id}
                  />
                </div>
              )}
              {isOwner && (
                <div className="flex flex-col">
                  <Link href={`/${name}/edit`}>
                    <button className="mt-2 plain-button">Edit Profile</button>
                  </Link>
                  {profile?.role === UserRoles.ADMIN && (
                    <Link href={`/admin`}>
                      <button className="mt-2 plain-button">Admin</button>
                    </Link>
                  )}
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
      {showDmModal && (
        <DmModal setShowDmModal={setShowDmModal} participantId={profile?.id!} />
      )}
    </header>
  );
};

export default ProfileHeader;
