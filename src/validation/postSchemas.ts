import { z } from "zod";

export const loadMorePostsSchema = z.object({
  page: z.number().positive("Invalid page number"),
  category: z.string().min(1, "Category is required").max(20, "Invalid category"),
});

export const addPostSchema = z.object({
  category: z.string().min(1, "Category is required").max(20, "Invalid category"),
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  body: z.string().min(1, "Body is required").max(5000, "Body must be less than 5000 characters"),
});

export const deletePostSchema = z.object({
  id: z.string().uuid("Post ID is required"),
});