"use client";
import { TpostContentString, TpostString } from "@types";
// components
import Docs from "@docComponents/docs";
import Api from "@docComponents/api";

const Page = () => {
  return (
    <Docs title="Create Post">
      <Docs.Introduction>
        <Api.Path path="/api/post/write" />
        <Api.Method method="POST" />
        <Docs.Description>
          <p>
            This endpoint allows authenticated users to create a new post. The
            authentication method used in the endpoint is based on session
            validation. The user must provide the post details in the request
            body. The session is validated to ensure the user is authenticated
            before allowing the post creation. Request body is form data.
          </p>
        </Docs.Description>
      </Docs.Introduction>
      <Docs.FolderWrap>
        <Docs.Folder title="Request Body">
          <Docs.Table
            description="The form data contains three different fields."
            items={formData}
          />

          <Api.Code
            title="Form data example:"
            description="New post request contains all the images as Blobs."
          >
            {formDataExample}
          </Api.Code>
        </Docs.Folder>
        <Docs.Folder title="Types">
          <Api.Code>{TpostString}</Api.Code>
          <Api.Code>{TpostContentString}</Api.Code>
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

const formData = [
  {
    key: "post",
    type: "Post",
    description: "A JSON string representing the post object.",
  },
  {
    key: "newImages",
    type: "number[]",
    description:
      "A JSON string representing an array of indexes of new images.",
  },
  {
    key: "[image-index]",
    type: "Blob",
    description:
      "Image files corresponding to the indexes in the post content.",
  },
];

const formDataExample = `{
  post: JSON-string = {
      id: number;
      imageFolder: string | null;
      title: string;
      author: string;
      content: [
          {
              "type": "Paragraph",
              "index": 0,
              "content": "...text..."
          },
          {
              "type": "Paragraph",
              "index": 1,
              "content": "...text..."
          },
          {
              "type": "Image",
              "index": 2,
              "content": "",
              "description": "..",
              "imageUpdated": true
          },
          {
              "type": "Image",
              "index": 3,
              "content": "",
              "description": "..",
              "imageUpdated": true
          },
          {
              "type": "Image",
              "index": 4,
              "content": "",
              "description": "..",
              "imageUpdated": true
          }
      ];
      createdAt?: Date;
      updatedAt?: Date;
      authorId: number;
      published: boolean;
  },
  newImages: JSON-string = [2, 3, 4],
  2: Blob,
  3: Blob,
  4: Blob,
}`;

const requestValues = [
  {
    key: "author",
    type: "string",
    required: true,
  },
  {
    key: "title",
    type: "string",
    required: true,
  },
  {
    key: "published",
    type: "boolean",
    required: false,
  },
  {
    key: "content",
    type: "PostContent[]",
    required: true,
  },
  {
    key: "newImages",
    type: "array",
    required: true,
  },
];

const successCodes = [{ code: 201, message: "Post created." }];

const errorCodes = [
  {
    code: 400,
    message: "Bad request. Ensure all required fields are correctly filled.",
  },
  { code: 401, message: "Unauthorized. User is not authenticated." },
  {
    code: 500,
    message: "Internal Server Error. An unexpected error occurred.",
  },
];
