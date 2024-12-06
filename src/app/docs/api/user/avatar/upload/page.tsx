"use client";
// types
//import { TputBlobResultString } from "@types";
// components
import Docs from "@docComponents/docs";
import Api from "@docComponents/api";

export const UploadAvatarDocs = () => {
  return (
    <Docs title="Upload Avatar">
      <Docs.Introduction>
        <Api.Path path="/api/user/avatar/upload" />
        <Api.Method method="POST" />

        <Docs.Description>
          {
            "This endpoint allows users to upload a new avatar image. The user must be logged in and provide an image file in the request body. The image is processed, stored, and the user's profile is updated with the new avatar URL."
          }
        </Docs.Description>
      </Docs.Introduction>
      <Docs.CloseFoldersBtn />
      <div className="flex flex-col gap-2">
        <Docs.Folder title="Request Body">
          <Docs.Table
            description="The request body contains the following fields."
            items={[
              {
                key: "file",
                type: "binary",
                description: "The image file to be uploaded.",
              },
            ]}
          />

          <Api.Code
            title="Form data example:"
            description="Upload avatar request contains the image file as binary data."
          >
            {`{
  file: binary
}`}
          </Api.Code>
        </Docs.Folder>

        <Docs.Folder title="Response Codes">
          <Api.ResponseCodes
            title="Success Codes"
            codes={[{ code: 201, message: "Avatar uploaded successfully." }]}
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

export default UploadAvatarDocs;
