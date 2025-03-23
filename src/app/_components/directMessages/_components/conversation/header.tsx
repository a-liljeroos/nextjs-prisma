"use client";
import Link from "next/link";
// types
import { ParticipantWithProfile } from "@types";
// functions
import { defaultAvatar } from "@clientFunctions";
// components
import Image from "next/image";

interface HeaderProps {
  participant: ParticipantWithProfile;
}

/**
 * Header component for displaying a participant's profile information.
 *
 * @param {HeaderProps} props - The props for the Header component.
 * @param {object} props.participant - The participant object containing user details.
 * @param {object} props.participant.user - The user object associated with the participant.
 * @param {string} props.participant.user.name - The name of the user.
 * @param {object} [props.participant.user.profile] - The profile object of the user (optional).
 * @param {string} [props.participant.user.profile.image] - The profile image URL of the user (optional).
 *
 * @returns {JSX.Element} A JSX element representing the header with the participant's profile image and name.
 */

const Header = ({ participant }: HeaderProps) => {
  const image = participant.user.profile?.image || defaultAvatar;
  return (
    <div className="flex items-center gap-2 bg-neutral-800 h-18 w-full py-2 px-2">
      <Link
        className="flex items-center gap-2 h-full w-full"
        href={`/${participant.user.name}`}
      >
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={image}
            alt="profile image"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <h1 className="font-bold">{participant.user.name}</h1>
      </Link>
    </div>
  );
};

export default Header;
