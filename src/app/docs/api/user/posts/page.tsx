"use client";
// components
import Docs from "@docComponents/docs";
import Api from "@docComponents/api";

const UserPostsDocs = () => {
  return (
    <Docs title="User Posts">
      <Docs.Introduction>
        <Api.Path path="/api/user/posts" />
        <Api.Method method="GET" />

        <Docs.Description>
          {
            "This endpoint allows users to retrieve posts by a specific user. The request must include the username as a query parameter. If the requester is the owner of the posts, all posts are returned. Otherwise, only published posts are returned."
          }
        </Docs.Description>
      </Docs.Introduction>
      <Docs.CloseFoldersBtn />
      <div className="flex flex-col gap-2">
        <Docs.Folder title="Query Parameters">
          <Docs.Table
            description="The query parameters contain the following fields."
            items={[
              {
                key: "name",
                type: "string",
                description:
                  "The username of the user whose posts are being retrieved.",
              },
            ]}
          />

          <Api.Code
            title="Query example:"
            description="User posts request contains the username as a query parameter."
          >
            {`/api/user/posts?name=exampleUsername`}
          </Api.Code>
        </Docs.Folder>
        <Docs.Folder title="Response Codes">
          <Api.ResponseCodes
            title="Success Codes"
            codes={[
              { code: 200, message: "User posts retrieved successfully." },
            ]}
          />
          <Docs.Hr />
          <Api.ResponseCodes
            title="Error Codes"
            codes={[
              { code: 400, message: "Bad request." },
              { code: 404, message: "User not found." },
              { code: 500, message: "Internal Server Error." },
            ]}
          />
        </Docs.Folder>
      </div>
    </Docs>
  );
};

export default UserPostsDocs;
