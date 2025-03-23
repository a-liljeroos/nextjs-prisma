"use client";
import React, { useRef, useState } from "react";
// components
import Button from "@components/buttons/Button";
import toast from "react-hot-toast";
// icons
import { GrSend } from "react-icons/gr";

interface MessageFormProps {
  handleSubmit: (message: string) => Promise<void>;
}

interface HandleKeyDownEvent extends React.KeyboardEvent<HTMLTextAreaElement> {}

const MessageForm = ({ handleSubmit }: MessageFormProps) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleKeyDown = (event: HandleKeyDownEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Message is required");
      return;
    }
    setLoading(true);
    try {
      await handleSubmit(message.trim());
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="overflow-hidden">
      <form
        ref={formRef}
        className="flex items-start rounded-b-2xl"
        onSubmit={(e) => {
          onSubmit(e);
        }}
      >
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          name="message"
          className="m-1 w-full bg-neutral-700 focus:outline-1 outline-neutral-600 px-3 rounded-2xl min-h-14 max-h-52 text-neutral-200"
          placeholder="Message..."
          onKeyDown={handleKeyDown}
          cols={30}
        />
        <div className="rounded-xl m-1 bg-neutral-200/80 ">
          <Button
            buttonProps={{
              type: "submit",
              disabled: loading,
            }}
            tooltip="Send"
            classBtn="transparent-button w-12 py-2"
          >
            <GrSend className="m-auto" size={22} color="rgb(49, 49, 49)" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessageForm;
