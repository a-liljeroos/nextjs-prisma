"use client";
// types
import { TcommentString, TcommentContentHistoryString } from "@types";
// components
import Docs from "@docComponents/docs";
import Api from "@docComponents/api";

export const EditCommentDocs = ({ commentId }: { commentId: string }) => {
  return (
    <Docs title="Edit Comment">
      <Docs.Introduction>
        <Api.Path path="/api/post/comment/edit" />
        <Api.Parameter param={commentId} />
        <Api.Method method="POST" />

        <Docs.Description>
          {
            "This endpoint allows users to edit a comment by its ID. The user must be logged in and provide the comment ID in the request body. The endpoint updates the comment content and maintains a history of previous content versions. Request body is form data."
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
            description="Edit comment request contains the comment object as a JSON string."
          >
            {`{
  comment: JSON-string = {
    commentId: number;
    content: string;
  }
}`}
          </Api.Code>
        </Docs.Folder>
        <Docs.Folder title="Types">
          <Api.Code>{TcommentString}</Api.Code>
          <Api.Code>{TcommentContentHistoryString}</Api.Code>
        </Docs.Folder>
        <Docs.Folder title="Response Codes">
          <Api.ResponseCodes
            title="Success Codes"
            codes={[{ code: 200, message: "Comment edited successfully." }]}
          />
          <Docs.Hr />
          <Api.ResponseCodes
            title="Error Codes"
            codes={[
              { code: 400, message: "Bad request." },
              { code: 500, message: "Internal Server Error." },
              { code: 401, message: "Unauthorized." },
            ]}
          />
        </Docs.Folder>
      </div>
    </Docs>
  );
};

export default EditCommentDocs;
