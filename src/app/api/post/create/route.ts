import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import tryWrapResponse from "@/utils/tryWrapResponse";
import { addPostSchema } from "@/validation/postSchemas";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { v4 as uuidv4 } from "uuid";
import { revalidateTag } from "next/cache";
import Category from "@/models/Category";
import User from "@/models/User";

export const POST = tryWrapResponse(async (request: NextRequest) => {
  const req = await request.json();
  addPostSchema.parse(req);

  const { category, title, body } = req;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  const newPost = new Post({
    id: uuidv4(),
    category,
    title,
    body,
    user: session?.user?.id,
  });
  await newPost.save();

  await Category.updateOne({ id: category }, { $inc: { postCount: 1 } });
  await User.updateOne({ id: session?.user?.id }, { $inc: { postCount: 1 } });

  revalidateTag("categories");
  revalidateTag("latest-posts");
  revalidateTag(`${category}-latest-posts`);

  return NextResponse.json({ success: true, id: newPost.id });
});
