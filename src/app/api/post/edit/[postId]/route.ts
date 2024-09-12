import { NextResponse, NextRequest } from "next/server";
// auth
import { auth } from "@serverAuth";
// types and validation
import { Post, PostContent } from "@types";
import { postSchema } from "@zValidation";
import { z } from "zod";
// functions
import { getPost, getUserId, editPost } from "@crudFunctions";
import {
  preparePostBody,
  CustomError,
  uploadImages,
  addBlobUrlsToPostContent,
  ImageUploadResult,
  deleteOldPostImages,
  getImageFolderPath,
} from "@postFunctions";
import { randomUUID } from "crypto";

// api/post/edit/[postId]/route.ts

const editPostSchema = postSchema.extend({
  id: z.number(),
  authorId: z.number(),
});

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user?.name) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const { name } = session.user;

    const postRequest = await preparePostBody(req, editPostSchema);

    let post: Post = postRequest.post;
    // array of indexes of new images added to the post
    const newImages = postRequest.newImages;
    const images = postRequest.images;

    const userId = await getUserId(name);

    const oldPost = await getPost(post.id);

    if (!userId || !oldPost) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    if (userId.id !== oldPost.authorId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    let postImageFolder = oldPost.imageFolder;

    if (
      !postImageFolder ||
      postImageFolder === null ||
      postImageFolder === ""
    ) {
      postImageFolder = randomUUID();
    }

    let imageUploadResults: ImageUploadResult[] = [];

    if (images && images.length > 0) {
      imageUploadResults = await uploadImages(
        images,
        userId.id,
        postImageFolder,
        newImages
      );
    }

    let processedContent: PostContent[] = [];

    if (imageUploadResults.length > 0) {
      processedContent = await addBlobUrlsToPostContent(
        postRequest.post.content,
        imageUploadResults
      );
      let currentUrls: string[] = [];
      processedContent.forEach((content) => {
        if (content.type === "Image") {
          currentUrls.push(content.content);
        }
      });
      if (currentUrls) {
        const folderPath = await getImageFolderPath(userId.id, postImageFolder);
        await deleteOldPostImages(folderPath, currentUrls);
      }
    } else {
      processedContent = postRequest.post.content;
    }

    post = {
      ...post,
      imageFolder: postImageFolder,
      content: processedContent,
    };

    await editPost(post);

    return NextResponse.json({ message: "Post updated." }, { status: 201 });
  } catch (error) {
    if (error instanceof CustomError) {
      console.error(error.errorCode, error.message);
      switch (error.errorCode) {
        case 400:
          return NextResponse.json({ error: "Bad request" }, { status: 400 });
        case 500:
          return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
          );
        default:
          console.error("An unknown error occurred:", error.message);
      }
    } else {
      console.error(error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
