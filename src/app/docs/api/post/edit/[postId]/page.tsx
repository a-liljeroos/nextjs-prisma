import React from "react";
// components
import EditPostDocs from "./editPostDocs";

const Page = async ({ params }: { params: { postId: string } }) => {
  return <EditPostDocs postId={params.postId} />;
};

export default Page;
