import { addPostSchema, deletePostSchema, loadMorePostsSchema } from "@/validation/postSchemas";
import { z } from "zod";
import { IUser } from "./user";

export interface IPost {
  id: string;
  user: Partial<IUser>;
  category: string;
  title: string;
  body: string;
  commentCount: number;
  createdAt?: string;
  updatedAt?: string;
}


export interface PostResponse {
  hasNext: boolean;
  data: IPost[];
}


export type LoadMorePostsInput = z.infer<typeof loadMorePostsSchema>;
export type AddPostInput = z.infer<typeof addPostSchema>;
export type DeletePostInput = z.infer<typeof deletePostSchema>;