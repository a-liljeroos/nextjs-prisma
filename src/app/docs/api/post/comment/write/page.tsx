"use client";
// types
import { TcommentString } from "@types";
// components
import Docs from "@docComponents/docs";
import Api from "@docComponents/api";

export const Page = () => {
  return (
    <Docs title="Write Comment">
      <Docs.Introduction>
        <Api.Path path="/api/post/comment/write" />
        <Api.Method method="POST" />

        <Docs.Description>
          {
            "This endpoint allows users to write a new comment on a post. The user must be logged in and provide the post ID and comment content in the request body. Request body is form data."
          }
        </Docs.Description>
      </Docs.Introduction>
      <Docs.CloseFoldersBtn />
      <div className="flex flex-col gap-2">
        <Docs.Folder title="Request Body">
          <Docs.Table
            description="The form data contains the following fields."
            items={[
              {
                key: "comment",
                type: "string",
                description: "A JSON string representing the comment object.",
              },
            ]}
          />

          <Api.Code
            title="Form data example:"
            description="Write comment request contains the comment object as a JSON string."
          >
            {`{
  comment: JSON-string = {
    postId: number;
    content: string;
  }
}`}
          </Api.Code>
        </Docs.Folder>
        <Docs.Folder title="Types">
          <Api.Code>{TcommentString}</Api.Code>
        </Docs.Folder>
        <Docs.Folder title="Response Codes">
          <Api.ResponseCodes
            title="Success Codes"
            codes={[{ code: 200, message: "Comment added successfully." }]}
          />
          <Docs.Hr />
          <Api.ResponseCodes
            title="Error Codes"
            codes={[
              { code: 400, message: "Bad request." },
              { code: 401, message: "Unauthorized." },
              { code: 500, message: "Internal Server Error." },
            ]}
          />
        </Docs.Folder>
      </div>
    </Docs>
  );
};

export default Page;
