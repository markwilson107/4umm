import { avatarSchema } from "@/validation/userSchemas";
import z from "zod";

export type AvatarSchema = z.infer<typeof avatarSchema>;

export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar: AvatarSchema;
  postCount: number;
  commentCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}
