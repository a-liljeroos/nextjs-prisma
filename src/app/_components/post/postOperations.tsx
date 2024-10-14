import toast from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";
// functions
import { deletePost } from "@crudFunctions";
import { delay } from "@functions";
// icons
import { TiDelete } from "react-icons/ti";
import { AiOutlineEdit } from "react-icons/ai";

interface PostOperationsProps {
  user: string | undefined;
  postId: string;
}

const PostOperations = ({ postId, user }: PostOperationsProps) => {
  const [showModal, setShowModal] = useState(false);
  const handleDelete = () => {
    deletePost(parseInt(postId)).then(() => {
      toast.success("Post deleted.");
      window.location.href = `/${user}`;
    });
  };

  if (!user) {
    return <></>;
  }

  const openModal = async () => {
    setShowModal(!showModal);
    await delay(5000);
    setShowModal(false);
  };

  return (
    <div className="p-3 flex gap-2">
      {!showModal ? (
        <>
          <Link href={`/post/edit/${postId}`}>
            <button className="plain-button">
              <AiOutlineEdit size={25} />
            </button>
          </Link>
          <button className="plain-button" onClick={openModal}>
            <TiDelete size={25} />
          </button>
        </>
      ) : (
        <>
          <button className="plain-button" onClick={handleDelete}>
            Delete
          </button>
          <button
            className="plain-button"
            onClick={() => setShowModal(!showModal)}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};

export default PostOperations;
