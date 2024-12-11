"use client";
// types
import {
  TpostString,
  TpostContentString,
  TpostContentTypeString,
} from "@types";
// components
import Docs from "@docComponents/docs";
import Api from "@docComponents/api";

const EditPostDocs = ({ postId }: { postId: string }) => {
  return (
    <Docs title="Edit post">
      <Docs.Introduction>
        <Api.Path path="/api/post/edit/[postId]" />
        <Api.Parameter param={postId} />
        <Api.Method method="PUT" />

        <Docs.Description>
          {
            "This endpoint allows users to edit a post by its ID. The user must be logged in and provide the post ID in the request parameters. The endpoint updates the post details along with the author's name. Request body is form data."
          }
        </Docs.Description>
      </Docs.Introduction>
      <Docs.CloseFoldersBtn />
      <div className="flex flex-col gap-2">
        <Docs.Folder title="URL Parameters">
          <Api.Code description="The request must contain the 'postId' parameter in the URL and the post details in the request body. Example:">
            {`/api/post/edit/10`}
          </Api.Code>
          <Docs.Table items={urlParams} />
        </Docs.Folder>
        <Docs.Folder title="Request body / Form data">
          <Docs.Table
            color="green"
            description="The form data contains three different fields."
            items={formData}
          />
          <Docs.Description>
            {
              "If an image is updated, the contents imageUpdated field should be set to true and the image should be included in the form data with a key of its index."
            }
          </Docs.Description>
          <Api.Code
            title="Form data example:"
            description="Images 3 and 4 are updated and included in the newImages array. "
          >
            {formDataExample}
          </Api.Code>
          <Docs.Description>
            {
              "Endpoint reads the newImages array and the images with the corresponding indexes. Deletes the old images and uploads the new ones to the Blob storage. The post object is updated with the new image URLs."
            }
          </Docs.Description>
        </Docs.Folder>
        <Docs.Folder title="Types">
          <Api.Code>{`import { Post } from "@types";`}</Api.Code>
          <Api.Code>{TpostString}</Api.Code>
          <Api.Code>{TpostContentString}</Api.Code>
          <Api.Code>{TpostContentTypeString}</Api.Code>
        </Docs.Folder>
        <Docs.Folder title="Response Codes">
          <Api.ResponseCodes title="Success Codes" codes={successCodes} />
          <Docs.Hr />
          <Api.ResponseCodes title="Error Codes" codes={errorCodes} />
        </Docs.Folder>
      </div>
    </Docs>
  );
};

export default EditPostDocs;

const urlParams = [
  {
    key: "postId",
    type: "number",
    required: true,
  },
];

const formData = [
  {
    key: "post",
    type: "Post",
    description: "A JSON string representing the post object.",
  },
  {
    key: "newImages",
    type: "string",
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
              "content": "https://example.com/image.jpg",
              "description": "..",
              "imageUpdated": false
          },
          {
              "type": "Image",
              "index": 3,
              "content": "https://example.com/image.jpg",
              "description": "..",
              "imageUpdated": true
          },
          {
              "type": "Image",
              "index": 4,
              "content": "https://example.com/image.jpg",
              "description": "..",
              "imageUpdated": true
          }
      ];
      createdAt?: Date;
      updatedAt?: Date;
      authorId: number;
      published: boolean;
  },
  newImages: JSON-string = [3, 4],
  3: Blob,
  4: Blob,
}`;

const successCodes = [{ code: 201, message: "Post updated." }];

const errorCodes = [
  {
    code: 400,
    message: "Bad request. Ensure the postId and authorId are valid numbers.",
  },
  { code: 401, message: "You must be logged in." },
  { code: 403, message: "Unauthorized." },
  {
    code: 500,
    message: "Internal Server Error. An unexpected error occurred.",
  },
];
