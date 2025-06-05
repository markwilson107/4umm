"use server";

import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import {
  AddPostInput,
  DeletePostInput,
  LoadMorePostsInput,
} from "@/types/post";
import {
  addPostSchema,
  deletePostSchema,
  loadMorePostsSchema,
} from "@/validation/postSchemas";

export async function loadMorePosts(input: LoadMorePostsInput) {
  const validatedInput = loadMorePostsSchema.parse(input);
  const { page, category } = validatedInput;

  await dbConnect();

  const query = category === "all" ? {} : { category };

  const [total, posts] = await Promise.all([
    Post.countDocuments(query),
    Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * 10)
      .limit(10),
  ]);

  return {
    success: true,
    posts,
    page,
    pages: total,
    hasNext: page * 10 < total,
    hasPrev: page > 1,
  };
}

export async function addPost(input: AddPostInput) {
  const validatedInput = addPostSchema.parse(input);
  const { title, body } = validatedInput;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  const post = new Post({ title, body, userId: session.user.id });
  await post.save();

  return { success: true, post };
}

export async function deletePost(input: DeletePostInput) {
  const validatedInput = deletePostSchema.parse(input);
  const { id } = validatedInput;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  await Post.deleteOne({ id, userId: session.user.id });

  return { success: true };
}
