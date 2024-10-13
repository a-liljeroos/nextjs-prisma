"use client";
import { ElementRef, useRef, useState, useEffect } from "react";
// react-query
import { useMutation, useQueryClient } from "@tanstack/react-query";
// components
import toast from "react-hot-toast";

interface WriteCommentProps {
  postId: string;
}

export const WriteComment = ({ postId }: WriteCommentProps) => {
  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const [formOpen, setFormOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (formOpen) textareaRef.current?.focus();
  }, [formOpen]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      return fetch(`/api/post/comment/write`, {
        method: "POST",
        body: data,
      });
    },
    onSettled: (data) => {
      if (data?.ok) {
        textareaRef.current!.value = "";
        setFormOpen(false);
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      } else {
        toast.error("Error submitting comment.");
      }
    },
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    const comment = textareaRef.current?.value;
    formData.append(
      "comment",
      JSON.stringify({ content: comment, postId: parseInt(postId) })
    );
    mutation.mutate(formData);
  };

  return (
    <div className="flex flex-col gap-3">
      {formOpen ? (
        <CommentForm
          handleSubmit={handleSubmit}
          textareaRef={textareaRef}
          setFormOpen={setFormOpen}
        />
      ) : (
        <button
          className="plain-button rounded-2xl cursor-text"
          onClick={() => {
            setFormOpen(!formOpen);
          }}
        >
          Leave a comment
        </button>
      )}
    </div>
  );
};

interface EditCommentProps {
  postId: string;
  commentId: number;
  content: string;
  setFormOpen: (open: boolean) => void;
  formOpen: boolean;
  invalidateQuery?: () => void;
}

export const EditComment = ({
  postId,
  commentId,
  content,
  formOpen,
  setFormOpen,
  invalidateQuery,
}: EditCommentProps) => {
  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (formOpen) {
      textareaRef.current!.value = content;
      textareaRef.current?.focus();
    }
  }, [formOpen]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      return fetch(`/api/post/comment/edit`, {
        method: "POST",
        body: data,
      });
    },
    onSettled: (data) => {
      if (data?.ok) {
        textareaRef.current!.value = "";
        setFormOpen(false);
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        invalidateQuery && invalidateQuery();
      } else {
        toast.error("Error editing comment.");
      }
    },
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    const comment = textareaRef.current?.value;
    formData.append(
      "comment",
      JSON.stringify({ content: comment, commentId: commentId })
    );
    mutation.mutate(formData);
  };

  return (
    <CommentForm
      handleSubmit={handleSubmit}
      textareaRef={textareaRef}
      setFormOpen={setFormOpen}
      submitText="Save"
    />
  );
};

interface CommentFormProps {
  handleSubmit: (e: React.FormEvent) => void;
  textareaRef: React.RefObject<ElementRef<"textarea">>;
  setFormOpen: (open: boolean) => void;
  submitText?: string;
}

export const CommentForm = ({
  handleSubmit,
  textareaRef,
  setFormOpen,
  submitText = "Comment",
}: CommentFormProps) => {
  return (
    <form
      className="p-2 border border-neutral-400 bg-transparent rounded-2xl"
      action="POST"
      onSubmit={handleSubmit}
    >
      <textarea
        required
        minLength={4}
        maxLength={300}
        ref={textareaRef}
        name="comment"
        className="bg-transparent text-white focus:outline-none"
      />
      <div className="mt-2 flex gap-2 justify-end">
        <button
          onClick={() => setFormOpen(false)}
          className="plain-button rounded-2xl "
          type="button"
          value="Cancel"
        >
          {" "}
          Cancel{" "}
        </button>
        <button
          className="plain-button rounded-2xl "
          type="submit"
          value="Comment"
        >
          {" "}
          {submitText}{" "}
        </button>
      </div>{" "}
    </form>
  );
};
