import { NextResponse, NextRequest } from "next/server";
// db
import prisma, { Prisma } from "@prisma/prismaClient";
// auth
import { auth } from "@serverAuth";
// types and validation
import { NewPost, PostContent } from "@types";
import { postSchema } from "@zValidation";
// functions
import { CustomError } from "@errors/customError";
import { getUserId } from "@crudFunctions";
import {
  preparePostBody,
  uploadImages,
  addBlobUrlsToPostContent,
  ImageUploadResult,
} from "@postFunctions";
import { randomUUID } from "crypto";

// api/post/write/route.ts

const createPost = async (post: NewPost & { imageFolder: string }) => {
  const { author, title, content, imageFolder } = post;
  const newPost = await prisma.post.create({
    data: {
      author: {
        connect: {
          name: author,
        },
      },
      title: title,
      content: content as Prisma.JsonArray,
      imageFolder: imageFolder,
    },
  });
  return newPost;
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user?.name) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const { name } = session.user;

    const postRequest = await preparePostBody(req, postSchema);

    const userId = await getUserId(name);

    if (!userId) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const images = postRequest.images;
    const newImages = postRequest.newImages;

    let imageUploadResults: ImageUploadResult[] = [];

    const newPostImageFolder = randomUUID();

    if (images && images.length > 0) {
      imageUploadResults = await uploadImages(
        images,
        userId.id,
        newPostImageFolder,
        newImages
      );
    }

    let processedContent: PostContent[] = [];

    if (imageUploadResults.length > 0) {
      processedContent = await addBlobUrlsToPostContent(
        postRequest.post.content,
        imageUploadResults
      );
    } else {
      processedContent = postRequest.post.content;
    }

    const post: NewPost & { imageFolder: string } = {
      ...postRequest.post,
      imageFolder: newPostImageFolder,
      content: processedContent,
    };

    await createPost(post);

    return NextResponse.json({ message: "Post created." }, { status: 201 });
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
