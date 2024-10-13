import { z } from "zod";

export const postSchema = z
  .object({
    author: z.string(),
    title: z.string().min(2).max(100),
    published: z.boolean().optional().default(false),
    imageFolder: z.string().nullable().optional().default(null),
    content: z
      .array(
        z.object({
          index: z.number(),
          type: z.enum(["Subheader", "Paragraph", "Image"]),
          content: z.string(),
          description: z.string().optional(),
          imageUpdated: z.boolean().optional(),
          inputId: z.string().optional(),
        })
      )
      .min(1)
      .max(30),
  })
  .required();

export const newImagesSchema = z.array(z.number());

export const commentSchema = z.object({
  postId: z.number(),
  content: z.string().min(2).max(500),
});

export const editCommentSchema = z.object({
  commentId: z.number(),
  content: z.string().min(2).max(500),
});
