import { z } from "zod";

export const addCommentSchema = z.object({
  postId: z.string().uuid("Post ID is required"),
  body: z.string().min(1, "Body is required").max(5000, "Body must be less than 5000 characters"),
});

export const deleteCommentSchema = z.object({
  id: z.string().uuid("Post ID is required"),
});

export const loadCommentsSchema = z.object({
  id: z.string().uuid("Post ID is required"),
  page: z.number({message: "Page number is required"})
});