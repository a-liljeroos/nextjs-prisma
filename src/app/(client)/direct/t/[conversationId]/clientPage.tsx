"use client";
import React from "react";
// query
import { useGetMessages } from "@components/directMessages/_components/conversation/displayChat";
// types
import { TConversation } from "@types";
// functions
import { sendMessage } from "@components/directMessages/_functions/functions";
// components
import Conversation from "@components/directMessages/_components/conversation/conversation";
import toast from "react-hot-toast";

interface ClientPageProps {
  conversation: TConversation;
  sessionUserId: number;
}

const ClientPage = ({ conversation, sessionUserId }: ClientPageProps) => {
  const { refetch } = useGetMessages(conversation.id, sessionUserId);
  const handleSubmit = async (message: string) => {
    const newMessage = await sendMessage(conversation.id, message);
    if (!newMessage) {
      toast.error("Failed to send message");
      return;
    }
    refetch();
  };
  const participant = conversation.participants.find(
    (p) => p.userId !== sessionUserId
  );
  return (
    <Conversation
      participant={participant}
      sessionUserId={sessionUserId}
      conversation={conversation}
      handleSubmit={handleSubmit}
    />
  );
};

export default ClientPage;
