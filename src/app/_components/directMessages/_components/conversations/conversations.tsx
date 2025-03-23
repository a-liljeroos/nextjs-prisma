"use server";
// functions
import { getConversations } from "../../_functions/functions";
// components
import DisplayConversations from "./displayConversations";

interface ConversationsProps {
  sessionUserId: number;
}

const Conversations = async ({ sessionUserId }: ConversationsProps) => {
  const conversations = await getConversations(sessionUserId);
  return (
    <div>
      <DisplayConversations
        sessionUserId={sessionUserId}
        conversations={conversations}
      />
    </div>
  );
};

export default Conversations;
