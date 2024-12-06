"use client";
import React from "react";
// components
import Docs from "@docComponents/docs";
import Api from "@docComponents/api";

const Page = () => {
  return (
    <Docs title="Update Username">
      <Docs.Introduction>
        <Api.Path path="/api/user/profile/update/username" />
        <Api.Method method="POST" />
        <Docs.Description>
          <p>Allows authenticated users to update their username.</p>
        </Docs.Description>
      </Docs.Introduction>
      <Docs.FolderWrap>
        <Docs.Folder title="Request Body">
          <Api.Code description="The request body must contain the new username. The username must be between 6 and 32 characters long.">
            {`{
    "newUsername": "string"
}`}
          </Api.Code>
          <Docs.Table
            description="Request Body Parameters"
            items={requestValues}
          />
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

const requestValues = [
  {
    key: "newUsername",
    type: "string",
    min: 6,
    max: 32,
    required: true,
  },
];

const successCodes = [{ code: 201, message: "Username changed." }];

const errorCodes = [
  {
    code: 400,
    message:
      "Invalid input. Ensure the 'newUsername' field is correctly filled.",
  },
  { code: 401, message: "Unauthorized. User is not authenticated." },
  { code: 409, message: "Conflict. The new username is already taken." },
  {
    code: 500,
    message: "Internal Server Error. An unexpected error occurred.",
  },
];
