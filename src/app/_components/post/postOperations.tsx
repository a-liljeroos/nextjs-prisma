import toast from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const navigateToEdit = () => {
    router.push(`/post/edit/${postId}`);
  };

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
    <div className="p-3 flex items-center gap-2">
      {!showModal ? (
        <>
          <button className="plain-button" onClick={navigateToEdit}>
            <AiOutlineEdit size={25} />
          </button>
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
