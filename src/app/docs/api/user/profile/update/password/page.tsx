"use client";
import React from "react";
// components
import Docs from "@docComponents/docs";
import Api from "@docComponents/api";

const Page = () => {
  return (
    <Docs title="Update Password">
      <Docs.Introduction>
        <Api.Path path="/api/user/profile/update/password" />
        <Api.Method method="POST" />
        <Docs.Description>
          Allows authenticated users to update their password.
        </Docs.Description>
      </Docs.Introduction>
      <Docs.FolderWrap>
        <Docs.Folder title="Request Body">
          <Api.Code description="The request body must contain the current password, new password, and confirmation of the new password. All fields are required.">
            {requestBody}
          </Api.Code>
          <Docs.Table description="Length values" items={requestValues} />
        </Docs.Folder>
        <Docs.Folder title="Response Codes">
          <Api.ResponseCodes title="Success" codes={successCodes} />
          <Api.ResponseCodes title="Error" codes={errorCodes} />
        </Docs.Folder>
      </Docs.FolderWrap>
    </Docs>
  );
};

export default Page;

const requestBody = `{
    "currentPassword": "string",
    "newPassword": "string",
    "confirmNewPassword": "string"
}`;

const requestValues = [
  {
    key: "currentPassword",
    min: 6,
    max: 32,
    required: true,
  },
  {
    key: "newPassword",
    min: 6,
    max: 32,
    required: true,
  },
  {
    key: "confirmNewPassword",
    min: 6,
    max: 32,
    required: true,
  },
];

const successCodes = [{ code: 201, message: "Password changed successfully." }];

const errorCodes = [
  {
    code: 400,
    message: "Invalid input. Ensure all fields are correctly filled.",
  },
  { code: 401, message: "Unauthorized. User is not authenticated." },
  {
    code: 500,
    message: "Internal Server Error. An unexpected error occurred.",
  },
];
