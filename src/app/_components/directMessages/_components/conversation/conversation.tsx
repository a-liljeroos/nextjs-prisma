import React from "react";
// types
import { TConversation, ParticipantWithProfile } from "@types";
// components
import MessageForm from "./messageForm";
import Header from "./header";
import DisplayChat from "./displayChat";

interface ConversationProps {
  participant?: ParticipantWithProfile;
  conversation: TConversation;
  sessionUserId: number;
  handleSubmit: (message: string) => Promise<void>;
}

/**
 * A React component that represents a conversation interface, including a header,
 * chat display, and a message form for sending messages.
 *
 * @component
 * @param {ParticipantWithProfile} [participant] - The participant of the conversation.
 * @param {TConversation} conversation - The conversation object containing details such as participants and ID.
 * @param {number} sessionUserId - The ID of the currently logged-in user.
 * @param {(message: string) => Promise<void>} handleSubmit - A function to handle message submission.
 *
 * @returns {JSX.Element} The rendered conversation component.
 */

const Conversation = ({
  participant,
  handleSubmit,
  conversation,
  sessionUserId,
}: ConversationProps) => {
  const { participants, id: conversationId } = conversation;
  return (
    <div className="flex flex-col w-full p-2">
      <Header participant={participant!} />
      <div className="chat-bg rounded-2xl">
        <DisplayChat
          participant={participant!}
          conversationId={conversationId}
          sessionUserId={sessionUserId}
        />
        <MessageForm handleSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default Conversation;
