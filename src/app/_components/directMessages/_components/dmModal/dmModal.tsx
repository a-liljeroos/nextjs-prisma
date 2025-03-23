"use client";
import React from "react";
import { useRouter } from "next/navigation";
// functions
import {
  createConversation,
  sendMessage,
} from "@components/directMessages/_functions/functions";
import { getClientUserId } from "@crudFunctions";
// components
import toast from "react-hot-toast";
import MessageForm from "@components/directMessages/_components/conversation/messageForm";
// icons
import { ImCancelCircle } from "react-icons/im";

interface DmModalProps {
  participantId: number;
  setShowDmModal: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * A modal component for sending direct messages to a participant.
 *
 * @component
 * @param {DmModalProps} props - The props for the DmModal component.
 * @param {string} props.participantId - The ID of the participant to whom the message will be sent.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setShowDmModal - A function to toggle the visibility of the modal.
 *
 * @description
 * This component renders a modal that allows users to send direct messages. It includes a form for entering the message
 * and handles the submission process, including creating a conversation, sending the message, and navigating to the
 * conversation thread. If an error occurs during the process, a toast notification is displayed.
 *
 * @example
 * ```tsx
 * const [showDmModal, setShowDmModal] = useState(false);
 *
 * return (
 *   <>
 *     {showDmModal && (
 *       <DmModal
 *         participantId="12345"
 *         setShowDmModal={setShowDmModal}
 *       />
 *     )}
 *   </>
 * );
 * ```
 */

const DmModal = ({ participantId, setShowDmModal }: DmModalProps) => {
  const router = useRouter();

  const handleSubmit = async (message: string) => {
    try {
      if (!message) {
        toast.error("Message is required");
        return;
      }

      const newConversation = await createConversation([participantId]);
      if (!newConversation) {
        throw new Error("");
      }

      const userId = await getClientUserId();
      if (!userId) {
        throw new Error("");
      }

      const newMessage = await sendMessage(newConversation.id, message);
      if (!newMessage) {
        throw new Error("");
      }

      toast.success("Message sent");
      router.push(`/direct/t/${newConversation.id}`);
    } catch (error) {
      toast.error("Could not send message");
    }
  };

  return (
    <div className="absolute z-40 top-48 py-14 px-2 w-full rounded-lg shadow-lg bg-neutral-900/30 backdrop-blur-[15px] openX">
      <div className="py-2 bg-neutral-600 border-b-2 border-neutral-500 shadow-lg rounded-lg ">
        <div className="flex items-center justify-between pr-3 m-2 rounded-full">
          <h2 className="px-3 text-[17px] select-none">Send Message</h2>
          <button
            className="transparent-button"
            onClick={() => setShowDmModal(false)}
          >
            <ImCancelCircle size={23} color="rgb(248, 248, 248)" />
          </button>
        </div>
        <div className="flex flex-col gap-2 w-full p-2">
          <MessageForm handleSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default DmModal;
