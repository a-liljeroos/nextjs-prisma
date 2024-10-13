// react-query
import { useQuery } from "@tanstack/react-query";
// functions
import { getComments } from "@crudFunctions";
// component
import Comment from "./comment";
import Spinner from "@components/spinner/spinner";

interface CommentListProps {
  postId: string;
  sessionName?: string | null | undefined;
}

const CommentList = ({ postId, sessionName }: CommentListProps) => {
  const {
    data: comments,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(parseInt(postId)),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading)
    return (
      <div className="p-2 w-full h-40 flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (isError)
    return (
      <div className="p-2 w-full h-40 flex items-center justify-center">
        Error loading comments.
      </div>
    );

  if (comments === undefined || comments?.length === 0 || comments === null)
    return (
      <div className="p-2 w-full h-40 flex items-center justify-center">
        No comments.
      </div>
    );

  return (
    <ul className="flex flex-col gap-2">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          postId={postId}
          comment={comment}
          sessionName={sessionName}
        />
      ))}
    </ul>
  );
};

export default CommentList;
