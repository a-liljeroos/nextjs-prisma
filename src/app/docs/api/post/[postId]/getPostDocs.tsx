"use client";
// types
import {
  TpostString,
  TpostContentString,
  TpostContentTypeString,
} from "@types";
// components
import Docs from "@docComponents/docs";
import Api from "@docComponents/api";

export const GetPostDocs = ({ postId }: { postId: string }) => {
  return (
    <Docs title="Get post">
      <Docs.Introduction>
        <Api.Path path="/api/post/[postId]" />
        <Api.Parameter param={postId} />
        <Api.Method method="GET" />
        <Docs.Description>
          {
            "This endpoint allows users to retrieve a post by its ID. The user must provide the post ID in the request parameters. The endpoint returns the post details along with the author's name."
          }
        </Docs.Description>
      </Docs.Introduction>
      <InteractionMap />
      <Docs.FolderWrap>
        <Docs.Folder title="Request Parameters">
          <Api.Code description="The request must contain the 'postId' parameter in the URL.">
            {`/api/post/[postId]`}
          </Api.Code>
          <Docs.Table items={requestValues} />
          <Api.Code description="Example:">{`/api/post/10`}</Api.Code>
        </Docs.Folder>
        <Docs.Folder title="Response type">
          <Api.Code>{`import { Post } from "@types";`}</Api.Code>
          <Api.Code>{TpostString}</Api.Code>
          <Api.Code>{TpostContentString}</Api.Code>
          <Api.Code>{TpostContentTypeString}</Api.Code>
        </Docs.Folder>
        <Docs.Folder title="Response codes">
          <Api.ResponseCodes title="Success" codes={successCodes} />
          <Docs.Hr />
          <Api.ResponseCodes title="Error" codes={errorCodes} />
        </Docs.Folder>
      </Docs.FolderWrap>
    </Docs>
  );
};

const requestValues = [
  {
    key: "postId",
    type: "number",
    required: true,
  },
];

const successCodes = [{ code: 200, message: "NaN" }];

const errorCodes = [
  {
    code: 400,
    message: "Bad request. Ensure the postId is a valid number.",
  },
  { code: 404, message: "Post not found." },
  {
    code: 500,
    message: "Internal Server Error. An unexpected error occurred.",
  },
];

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

const InteractionMap = () => {
  const [postId, setPostId] = useState<string>("1");
  const [data, setData] = useState<any>(null);
  const mutation = useMutation({
    mutationFn: async (postId_: string) => {
      const response = await fetch(`/api/post/${postId_}`, {
        method: "GET",
      });

      return response.json();
    },
    onSettled: (data, error, variables, context) => {
      setData({
        status: data.status,
        response: data,
        error,
        variables,
        context,
      });
    },
  });

  return (
    <Api.InteractionMap
      method="GET"
      path={`/api/post/${postId}`}
      kids={[
        <>
          <form
            action=""
            className="flex  gap-2 p-2 bg-neutral-600 rounded-lg"
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutateAsync(postId);
            }}
          >
            <input
              type="text"
              placeholder="Post ID"
              onChange={(e) => setPostId(e.target.value)}
              className="w-full bg-neutral-400 focus:bg-neutral-300 focus:outline-none"
            />

            <button className="transparent-button mx-4 font-bold">Send</button>
          </form>
        </>,
        <>
          <div className="flex flex-col items-center bg-neutral-500 w-full h-96 mt-4 p-4 rounded-lg w-full relative overflow-auto text-ellipsis">
            <div>
              <pre className="absolute left-6">
                Data: {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        </>,
      ]}
    />
  );
};
