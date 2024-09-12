"use server";
import { NextResponse, NextRequest } from "next/server";
import { PostContent, Post, PostRequest, PostRequestImage } from "@types";
import { postSchema, newImagesSchema } from "@zValidation";
import { z } from "zod";
import { put, del, list } from "@vercel/blob";
import type { PutBlobResult } from "@vercel/blob";
import { randomUUID } from "crypto";
// image processing
const sharp = require("sharp");

export class CustomError extends Error {
  errorCode: number;

  constructor(message: string, errorCode: number) {
    super(message);
    this.errorCode = errorCode;
    this.name = "CustomError";
  }
}

/**
 * Returns the path for the image folder.
 */

export function getImageFolderPath(userId: number, imageFolder: string) {
  return `/posts/${userId}/${imageFolder}`;
}

// functions for processing post content

/**
 * Checks if the buffer is an image.
 * @param buffer - The buffer to check.
 * @returns - A boolean indicating if the buffer is an image.
 */

export function isImage(buffer: Uint8Array) {
  const signatures = [
    { header: [0x89, 0x50, 0x4e, 0x47], format: "PNG" },
    { header: [0xff, 0xd8, 0xff], format: "JPEG" },
    { header: [0x52, 0x49, 0x46, 0x46], format: "WebP" },
    {
      header: [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70],
      format: "AVIF",
    },
  ];

  return signatures.some((signature) =>
    signature.header.every((byte, index) => buffer[index] === byte)
  );
}

/**
 * Cleans the string contents of an array of PostContent objects.
 * @param content - The array of PostContent objects to clean.
 * @returns - The cleaned array of PostContent objects.
 */

export function trimPostContent(content: PostContent[]): PostContent[] {
  return content.map((content) => {
    const cleanedContent = {
      ...content,
      content: content.content.trim(),
      description: content.description?.trim(),
    };
    return cleanedContent;
  });
}

/**
 * Creates javascript object from the form data.
 * @param req - The request object.
 * @param zodSchema - The zod schema to validate the post body.
 */

export async function preparePostBody(
  req: NextRequest,
  zodSchema: any
): Promise<PostRequest> {
  try {
    const body = await req.formData();
    if (!body.has("post")) {
      throw new CustomError("You must provide a post.", 400);
    }
    const postBody = body.get("post") as string;
    const postResult = zodSchema.safeParse(JSON.parse(postBody));

    if (!postResult.success) {
      console.log("postResult.error: ", postResult.error.cause);
      throw new CustomError("", 400);
    }

    const post = postResult.data as Post;

    const newImagesBody = body.get("newImages") as string;
    const newImagesResult = newImagesSchema.safeParse(
      JSON.parse(newImagesBody)
    );

    if (!newImagesResult.success) {
      console.log("newImagesResult.error: ", newImagesResult.error);
      throw new CustomError("", 400);
    }

    const newImages: number[] = newImagesResult.data;

    let images: PostRequestImage[] = [];

    for (const content of post.content) {
      if (content.type === "Image" && body.has(content.index.toString())) {
        const contentIndex = content.index;
        const file = new Uint8Array(
          await new Response(body.get(contentIndex.toString())).arrayBuffer()
        );
        if (!isImage(file)) {
          throw new CustomError("Bad request", 400);
        }
        images.push({ index: content.index, image: file });
      }
    }

    return { post: post, images: images, newImages: newImages };
  } catch (error: any) {
    throw new CustomError(error.message, 500);
  }
}

export type ImageUploadResult = {
  index: number;
  imageUrl: string;
};

/**
 * Uploads images to the server.
 * @param images - The images to upload.
 * @param userId - The id of the user.
 * @param postImageFolder - The name of the folder for the post images.
 * @param newImages - The indexes of the new images.
 */

export async function uploadImages(
  images: PostRequestImage[],
  userId: number,
  postImageFolder: string,
  newImages: number[]
): Promise<ImageUploadResult[]> {
  try {
    const filename = randomUUID() + ".avif";
    const imageFolderPath = getImageFolderPath(userId, postImageFolder);
    const filePath = `${imageFolderPath}/${filename}`;
    let uploadedImages: ImageUploadResult[] = [];
    for (const image of images) {
      const file = image.image;
      const imageIndex = image.index;
      if (!newImages.includes(imageIndex)) continue;
      const blob: PutBlobResult = await sharp(file)
        .avif()
        .toBuffer()
        .then((data: any) => {
          return put(filePath, data, {
            access: "public",
          });
        })
        .catch((error: any) => {
          console.log("error: ", error);
          throw new CustomError("Image upload error.", 500);
        });
      const imgUrl = blob.url;
      uploadedImages.push({ index: imageIndex, imageUrl: imgUrl });
    }
    return uploadedImages;
  } catch (error: any) {
    throw new CustomError(error.message, 500);
  }
}

export function addBlobUrlsToPostContent(
  content: PostContent[],
  uploadedImages: {
    index: number;
    imageUrl: string;
  }[]
): PostContent[] {
  try {
    const updatedContent: PostContent[] = content.map((content) => {
      if (content.type === "Image") {
        const imgUrl = uploadedImages.find(
          (image) => image.index === content.index
        )?.imageUrl;

        if (!imgUrl) {
          throw new CustomError("Could not find images urls.", 400);
        }

        const updatedContent = {
          ...content,
          content: imgUrl,
        };
        return updatedContent;
      } else {
        return content;
      }
    });
    return updatedContent;
  } catch (error: any) {
    throw new CustomError(error.message, 500);
  }
}

/**
 * Deletes old images from the server.
 * @param imageFolder - The folder containing the images.
 * @param newImages - Urls of the current images.
 */

export async function deleteOldPostImages(
  imageFolder: string,
  currentUrls: string[]
) {
  try {
    const { blobs } = await list({
      mode: "folded",
      prefix: `${imageFolder}/`,
    });

    await Promise.all(
      blobs.map(async (blob) => {
        if (!currentUrls.includes(blob.url)) {
          await del(blob.url);
        }
      })
    );
  } catch (error) {
    console.error({
      "Error deleting old images: ": error,
      folder: imageFolder,
    });
  }
}
