"use client";
import React from "react";
import Link from "next/link";
// functions
import { timeAndDate, defaultAvatar } from "@clientFunctions";
// components
import Image from "next/image";

interface DisplayConversationsProps {
  conversations: ({
    participants: {
      userId: number;
      conversationId: number;
      lastReadAt: Date | null;
      user: {
        name: string;
        profile: {
          image: string | null;
        } | null;
      };
    }[];
  } & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
  })[];
  sessionUserId: number;
}

const DisplayConversations = ({
  conversations,
  sessionUserId,
}: DisplayConversationsProps) => {
  return (
    <div>
      {conversations.length === 0 && (
        <div className="flex justify-center items-center h-20">
          <p>No conservations.</p>
        </div>
      )}
      {conversations.map((conversation) => {
        const participant = conversation.participants.find(
          (p) => p.userId !== sessionUserId
        );
        return (
          <Link
            href={`/direct/t/${conversation.id}`}
            key={conversation.id}
            prefetch={true}
          >
            <div
              key={conversation.id}
              className="flex gap-4 items-center p-4 transition hover:bg-backgroundSecondary hover:text-black cursor-pointer"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={participant?.user.profile?.image || defaultAvatar}
                  alt="profile"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div>
                <p>{participant?.user.name}</p>
                <i className="opacity-50 text-sm">
                  {participant?.lastReadAt
                    ? "Last read " + timeAndDate(participant.lastReadAt)
                    : "Unread"}
                </i>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default DisplayConversations;
