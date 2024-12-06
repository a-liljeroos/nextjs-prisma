import React from "react";
// components
import { GetPostDocs } from "./getPostDocs";

const Page = async ({ params }: { params: { postId: string } }) => {
  return <GetPostDocs postId={params.postId} />;
};

export default Page;
