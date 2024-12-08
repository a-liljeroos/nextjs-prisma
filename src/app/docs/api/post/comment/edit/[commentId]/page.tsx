import React from "react";
// components
import EditCommentPage from "./editCommentPage";

const Page = async ({ params }: { params: { commentId: string } }) => {
  return <EditCommentPage commentId={params.commentId} />;
};

export default Page;
