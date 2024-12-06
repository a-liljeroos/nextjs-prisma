"use client";
import React from "react";
// components
import Docs from "@docComponents/docs";
import Api from "@docComponents/api";

const requestValues = [
  {
    key: "name",
    type: "string",
    required: true,
  },
];

const successCodes = [
  { code: 200, message: "User profile fetched successfully." },
];

const errorCodes = [
  {
    code: 400,
    message:
      "Invalid input. Ensure the 'name' parameter is correctly provided.",
  },
  { code: 404, message: "User not found." },
  {
    code: 500,
    message: "Internal Server Error. An unexpected error occurred.",
  },
];

const Page = () => {
  return (
    <Docs title="Fetch User Profile">
      <Docs.Introduction>
        <Api.Path path="/api/user/profile" />
        <Api.Method method="GET" />
        <Docs.Description>
          {
            "This endpoint allows fetching the profile of a user by their name. The authentication method used in the endpoint is based on session validation. The user must provide the 'name' parameter in the query string. The session is validated to ensure the user is authenticated before fetching the profile."
          }
        </Docs.Description>
      </Docs.Introduction>
      <Docs.FolderWrap>
        <Docs.Folder title="Request Query Parameters">
          <Api.Code description="The request must contain the 'name' parameter in the query string.">
            {`{
    "name": "string"
}`}
          </Api.Code>
          <Docs.Table description="Query Parameters" items={requestValues} />
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
