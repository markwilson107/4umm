import { IUser } from "./user";

export interface IComment {
  id: string;
  user: Partial<IUser>;
  postId: string;
  body: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommentResponse {
  hasNext: boolean;
  data: IComment[];
}
