"use client";
// components
import Docs from "@docComponents/docs";
import Api from "@docComponents/api";

const LoginDocs = () => {
  return (
    <Docs title="User Login">
      <Docs.Introduction>
        <Api.Path path="/api/user/login" />
        <Api.Method method="POST" />

        <Docs.Description>
          {
            "This endpoint allows users to log in by providing their username and password. The request body must include a CSRF token, username, and password."
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
                key: "csrfToken",
                type: "string",
                description: "The CSRF token for security.",
              },
              {
                key: "name",
                type: "string",
                description: "The username of the user.",
              },
              {
                key: "password",
                type: "string",
                description: "The password of the user.",
              },
            ]}
          />

          <Api.Code
            title="Request body example:"
            description="Login request contains the CSRF token, username, and password."
          >
            {`{
  csrfToken: "exampleCsrfToken",
  name: "exampleUsername",
  password: "examplePassword"
}`}
          </Api.Code>
        </Docs.Folder>

        <Docs.Folder title="Response Codes">
          <Api.ResponseCodes
            title="Success Codes"
            codes={[{ code: 200, message: "User logged in successfully." }]}
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

export default LoginDocs;
