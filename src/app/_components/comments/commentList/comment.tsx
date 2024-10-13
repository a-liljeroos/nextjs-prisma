import { useState } from "react";
import Link from "next/link";
// react-query
import { useMutation, useQueryClient } from "@tanstack/react-query";
// types
import { PostCommentFetch, CommentContentHistory } from "@types";
// functions
import { isToday, isYesterday } from "@clientFunctions";
import { deleteComment } from "@crudFunctions";
// icons
import { TbTrash } from "react-icons/tb";
import { AiOutlineEdit } from "react-icons/ai";
// components
import toast from "react-hot-toast";
import { EditComment } from "../commentForm";

interface CommentProps {
  postId: string;
  comment: PostCommentFetch;
  sessionName?: string | null | undefined;
}

const Comment = ({ postId, comment, sessionName }: CommentProps) => {
  const { author, content, createdAt, id: commentId, contentHistory } = comment;
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showEditHistory, setShowEditHistory] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const queryClient = useQueryClient();
  const isOwner = sessionName === author.name;

  const mutation = useMutation({
    mutationFn: () => deleteComment(comment.id),
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      } else {
        toast.error("Error deleting comment.");
      }
    },
  });

  return (
    <li
      className="px-4 py-3 rounded-lg bg-neutral-800 list-none"
      style={{ fontSize: 16 }}
    >
      <div
        className={`flex justify-between items-center h-10 comment-header ${
          showEditHistory && "mb-1"
        }`}
      >
        <div className="flex gap-2 items-center">
          <span role="button" className="font-bold">
            <Link href={`/${author.name}`}>{author.name}</Link>
          </span>
          {contentHistory && contentHistory.length > 0 && (
            <span
              role="button"
              className="text-neutral-500 mr-2"
              onClick={() => setShowEditHistory(!showEditHistory)}
            >
              • edited
            </span>
          )}
        </div>
        <div className="flex items-center">
          {deleteModalOpen ? (
            <>
              <button
                className="plain-button h-7 px-3"
                style={{ fontSize: 14 }}
                onClick={() => {
                  mutation.mutate();
                  setDeleteModalOpen(false);
                }}
              >
                Delete
              </button>
              <button
                className="ml-2 plain-button h-7 px-3"
                style={{ fontSize: 14 }}
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <DisplayDate date={createdAt} />
              {isOwner && (
                <>
                  <span
                    className="ml-4"
                    role="button"
                    onClick={() => setDeleteModalOpen(true)}
                    style={{ paddingBottom: 1 }}
                  >
                    <TbTrash color="white" size={17} />
                  </span>
                  <span
                    className="ml-2"
                    role="button"
                    onClick={() => setFormOpen(true)}
                  >
                    <AiOutlineEdit color="white" size={17} />
                  </span>
                </>
              )}
            </>
          )}
        </div>
      </div>
      {formOpen ? (
        <div className="p-2">
          <EditComment
            postId={postId}
            commentId={commentId}
            content={content}
            formOpen={formOpen}
            setFormOpen={setFormOpen}
          />
        </div>
      ) : (
        <>
          {showEditHistory && (
            <EditCommentHistory
              setShowEditHistory={setShowEditHistory}
              contentHistory={contentHistory!}
            />
          )}
          <p className={`py-2 ${!showEditHistory && "-translate-y-1"}`}>
            {content}
          </p>
        </>
      )}
    </li>
  );
};

const EditCommentHistory = ({
  contentHistory,
  setShowEditHistory,
}: {
  contentHistory: CommentContentHistory[];
  setShowEditHistory: (showEditHistory: boolean) => void;
}) => {
  return (
    <div className="p-1 pl-2 mb-1 flex flex-col gap-1 bg-neutral-700 rounded-lg">
      <h4
        className="ml-1 font-bold"
        role="button"
        onClick={() => setShowEditHistory(false)}
      >
        Edit history
      </h4>
      <div className="flex flex-col gap-1" style={{ fontSize: 15 }}>
        {contentHistory &&
          contentHistory.length > 0 &&
          contentHistory.map(({ content, createdAt }, index) => {
            const date = new Date(createdAt);
            return (
              <div
                key={index}
                className="p-3 flex flex-col rounded-lg bg-neutral-800"
              >
                <div className="text-neutral-500">
                  <DisplayDate date={date} />
                </div>
                <p className="py-1">{content}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const DisplayDate = ({ date: createdAt }: { date: Date }) => {
  const shouldDisplayFullDate = (date: Date): boolean => {
    return !isToday(date) && !isYesterday(date);
  };
  return (
    <>
      {isYesterday(createdAt) && <span className="mr-2">Yesterday</span>}
      <span>
        {createdAt.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        })}
      </span>
      {shouldDisplayFullDate(createdAt) && (
        <span className="ml-2">
          {createdAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      )}{" "}
    </>
  );
};

export default Comment;
