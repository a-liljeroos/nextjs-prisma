import Link from "next/link";
import { usePathname } from "next/navigation";
// auth
import { signIn, useSession } from "next-auth/react";
// components
import { WriteComment } from "./commentForm";
import CommentList from "./commentList/commentList";
import { useIntersectionObserver } from "@clientFunctions";
// styles
import "./Comments.scss";

interface CommentSectionProps {
  postId: string;
}

const CommentSection = ({ postId }: CommentSectionProps) => {
  const { data: session } = useSession();

  const [isVisible, elementRef] = useIntersectionObserver();
  return (
    <div
      ref={elementRef}
      id={postId + "comments"}
      className="p-3 flex flex-col gap-4 bg-background rounded-lg shadow-lg"
    >
      <h3 style={{ fontSize: 18 }} className="pl-1 -mb-1">
        Comments
      </h3>
      {session ? (
        <WriteComment postId={postId} />
      ) : (
        <SignOrRegister postId={postId} />
      )}
      {isVisible && (
        <CommentList postId={postId} sessionName={session?.user?.name} />
      )}
    </div>
  );
};

export default CommentSection;

const SignOrRegister = ({ postId }: { postId: string }) => {
  const pathname = usePathname();
  const callbackUrl = pathname + "#" + postId + "comments";
  return (
    <div className="py-2 pl-1">
      <a
        className="underline cursor-pointer"
        onClick={() => signIn("credentials", { callbackUrl: callbackUrl })}
      >
        Sign in
      </a>{" "}
      or{" "}
      <Link href="/register" className="underline">
        register
      </Link>{" "}
      to comment.
    </div>
  );
};
