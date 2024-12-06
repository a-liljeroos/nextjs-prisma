"use client";
import React from "react";
// components
import Docs from "@docComponents/docs";
import Api from "@docComponents/api";

const requestValues = [
  {
    key: "id",
    values: "number",
    required: true,
  },
  {
    key: "bio",
    values: "string",
    required: true,
  },
];

const successCodes = [{ code: 201, message: "User bio updated successfully" }];

const errorCodes = [
  { code: 400, message: "Invalid request body" },
  { code: 401, message: "Unauthorized" },
  { code: 404, message: "User not found" },
  { code: 500, message: "Internal Server Error" },
];

const Page = () => {
  return (
    <Docs title="Update Bio">
      <Docs.Introduction>
        <Api.Path path="/api/user/profile/update/bio" />
        <Api.Method method="POST" />
        <Docs.Description>
          Allows authenticated user to change their bio.{" "}
        </Docs.Description>
      </Docs.Introduction>
      <Docs.FolderWrap>
        <Docs.Folder title="Request body">
          <Api.Code description="Maximum bio length is 78 characters.">
            {`{
    "id": number,
    "bio": "string"
}`}
          </Api.Code>
          <Docs.Table description="Request body fields" items={requestValues} />
        </Docs.Folder>
        <Docs.Folder title="Response Codes">
          <Api.ResponseCodes title="Success Codes" codes={successCodes} />
          <Docs.Hr />
          <Api.ResponseCodes title="Error Codes" codes={errorCodes} />
        </Docs.Folder>
      </Docs.FolderWrap>
    </Docs>
  );
};

export default Page;
