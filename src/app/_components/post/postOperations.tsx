import toast from "react-hot-toast";
import { useState } from "react";
// functions
import { deletePost } from "@crudFunctions";
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

  return (
    <div className="p-3 flex gap-2">
      {!showModal ? (
        <>
          <button>
            <AiOutlineEdit size={25} />
          </button>
          <button onClick={() => setShowModal(!showModal)}>
            <TiDelete size={25} />
          </button>
        </>
      ) : (
        <>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={() => setShowModal(!showModal)}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default PostOperations;
