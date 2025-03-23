"use client";
import { useEffect, useRef } from "react";
// react-query
import { useQuery } from "@tanstack/react-query";
// types
import { Message, ParticipantWithProfile } from "@types";
// functions
import {
  getConversationMessages,
  updateLastReadAt,
} from "../../_functions/functions";
import { defaultAvatar, dateOnly } from "@clientFunctions";
// components
import Image from "next/image";
// styles
import "./conversation.scss";

export const useGetMessages = (
  conversationId: number,
  sessionUserId: number
) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversationMessages(conversationId, sessionUserId),
  });

  return { data, isLoading, isError, refetch };
};

interface DisplayChatProps {
  participant: ParticipantWithProfile;
  conversationId: number;
  sessionUserId: number;
}

/**
 * Component to display a chat conversation with messages.
 *
 * @param {DisplayChatProps} props - The props for the DisplayChat component.
 * @param {Participant} props.participant - The participant of the conversation, including user details.
 * @param {string} props.conversationId - The unique identifier for the conversation.
 * @param {string} props.sessionUserId - The ID of the currently logged-in user.
 *
 * @returns {JSX.Element} A JSX element that renders the chat interface.
 *
 * @remarks
 * - Fetches messages for the given conversation and user session using `useGetMessages`.
 * - Automatically scrolls to the bottom of the chat when new messages are loaded.
 * - Updates the `lastReadAt` timestamp for the conversation when messages are loaded.
 *
 * @example
 * ```tsx
 * <DisplayChat
 *   participant={participant}
 *   conversationId="12345"
 *   sessionUserId="67890"
 * />
 * ```
 */
const DisplayChat = ({
  participant,
  conversationId,
  sessionUserId,
}: DisplayChatProps) => {
  const { data: messages, isError } = useGetMessages(
    conversationId,
    sessionUserId
  );

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current?.scrollHeight);
    updateLastReadAt(conversationId, sessionUserId);
  }, [messages]);

  const pariticpantImage = participant.user.profile?.image || defaultAvatar;

  return (
    <div className="relative ">
      <div className="chat-shadow"></div>
      <div
        ref={chatRef}
        className="flex flex-col gap-2 w-full h-96 chat-bg rounded py-4 px-2 overflow-y-auto"
      >
        {messages ? (
          <MessageGroup
            lastReadAt={participant.lastReadAt}
            sessionUserId={sessionUserId}
            messages={messages}
            image={pariticpantImage}
          />
        ) : (
          <></>
        )}
        {isError && (
          <div className="flex justify-center items-center h-20">
            <p>Error on loading messages...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayChat;

/**
 * Component to display a grouped list of messages in a chat conversation.
 * Messages are grouped by sender and optionally display a date header
 * when the date changes between message groups.
 *
 * @param {Object} props - The props for the component.
 * @param {Message[]} props.messages - The list of messages to display.
 * @param {string} props.image - The profile image URL of the other user.
 * @param {number} props.sessionUserId - The ID of the currently logged-in user.
 * @param {Date | null} props.lastReadAt - The timestamp of the last read message.
 *
 * @returns {JSX.Element} The rendered message groups with optional date headers.
 */

const MessageGroup = ({
  messages,
  image,
  sessionUserId,
  lastReadAt,
}: {
  lastReadAt: Date | null;
  messages: Message[];
  image: string;
  sessionUserId: number;
}) => {
  const messagesWithIsSeen = addIsSeenProperty(messages, lastReadAt);
  const groupedMessages = groupMessagesBySender(messagesWithIsSeen);
  return (
    <>
      {groupedMessages.map((messageGroup, index) => {
        const isMe = messageGroup[0].senderId === sessionUserId;
        const groupDate = new Date(messageGroup[0].createdAt);
        const formattedDate = dateOnly(groupDate);

        // Determine if the date header should be shown.
        let showDateHeader = true;
        if (index > 0) {
          const prevGroupDate = new Date(
            groupedMessages[index - 1][0].createdAt
          );
          const prevFormattedDate = dateOnly(prevGroupDate);
          showDateHeader = formattedDate !== prevFormattedDate;
        }
        return (
          <>
            {showDateHeader && (
              <div className="mx-auto my-4 px-10 py-1 w-1/2 text-neutral-200 text-[13px] text-center bg-neutral-600/60 rounded-full shadow">
                {formattedDate}
              </div>
            )}
            <div className={`flex ${isMe && "justify-end"}`} key={index}>
              <div
                className={`flex items-end gap-3 w-3/4 ${
                  isMe && "flex-row-reverse"
                }`}
              >
                {!isMe && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden translate-y-1">
                    <Image
                      src={image}
                      alt="Profile image"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
                <div
                  className={`flex flex-col gap-2 w-full ${
                    isMe && "items-end"
                  }`}
                >
                  {messageGroup.map((message) => (
                    <Bubble key={message.id} message={message} isMe={isMe} />
                  ))}
                </div>
              </div>
            </div>
          </>
        );
      })}
    </>
  );
};

import { IoMdCheckmark } from "react-icons/io";
import { IoCheckmarkDone } from "react-icons/io5";

type MessageWithIsSeen = Message & { isSeen: boolean };

interface BubbleProps {
  message: MessageWithIsSeen;
  isMe: boolean;
}

/**
 * A functional component that renders a chat bubble for a message.
 *
 * @param {BubbleProps} props - The properties for the Bubble component.
 * @param {Object} props.message - The message object containing the content and metadata.
 * @param {string} props.message.content - The text content of the message.
 * @param {Date} props.message.createdAt - The timestamp when the message was created.
 * @param {boolean} props.message.isSeen - Indicates whether the message has been seen.
 * @param {boolean} props.isMe - Indicates whether the message was sent by the current user.
 *
 * @returns {JSX.Element} A styled chat bubble displaying the message content, timestamp, and status.
 */
const Bubble = ({ message, isMe }: BubbleProps) => {
  return (
    <div
      className={`flex flex-col justify-start w-fit bg-blue-400/30 pt-1 shadow rounded-md`}
    >
      <p className={`text-m px-2 pr-5`}>{message.content}</p>
      <div className="flex gap-[2px] items-center justify-end px-1 text-[12px] opacity-70 ">
        <p className="translate-y-[1px]">
          {message.createdAt.getHours()}:
          {String(message.createdAt.getMinutes()).padStart(2, "0")}
        </p>
        {isMe && !message.isSeen && <IoMdCheckmark size={15} />}
        {isMe && message.isSeen && <IoCheckmarkDone size={15} />}
      </div>
    </div>
  );
};

/**
 * Adds an `isSeen` property to each message in the provided array of messages.
 * The `isSeen` property indicates whether the message was seen based on the `lastReadAt` timestamp.
 *
 * @param messages - An array of messages to process. Each message must include a `createdAt` property.
 * @param lastReadAt - A timestamp representing the last time messages were read. If `null`, all messages will be marked as not seen.
 * @returns A new array of messages, each with an additional `isSeen` property indicating whether the message was seen.
 */

function addIsSeenProperty(
  messages: Message[],
  lastReadAt: Date | null
): MessageWithIsSeen[] {
  return messages.map((message) => ({
    ...message,
    isSeen: lastReadAt ? message.createdAt <= lastReadAt : false,
  }));
}

/**
 * Groups an array of messages by their sender.
 *
 * This function takes an array of messages and groups them into subarrays,
 * where each subarray contains consecutive messages from the same sender.
 *
 * @param messages - An array of messages to be grouped. Each message is expected
 * to have a `senderId` property to determine the sender.
 * @returns An array of message groups, where each group is an array of messages
 * from the same sender.
 */

function groupMessagesBySender(
  messages: MessageWithIsSeen[]
): MessageWithIsSeen[][] {
  const result = [];
  let group: MessageWithIsSeen[] = [];

  for (let i = 0; i < messages.length; i++) {
    if (
      group.length === 0 ||
      group[group.length - 1].senderId === messages[i].senderId
    ) {
      group.push(messages[i]);
    } else {
      result.push(group);
      group = [messages[i]];
    }
  }
  if (group.length > 0) {
    result.push(group);
  }

  return result;
}
