import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import tryWrapResponse from "@/utils/tryWrapResponse";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { revalidateTag } from "next/cache";
import User from "@/models/User";
import { addCommentSchema } from "@/validation/commentSchemas";
import Comment from "@/models/Comment";
import { authOptions } from "../../auth/utils/authOptions";

export const POST = tryWrapResponse(async (request: NextRequest) => {
  const req = await request.json();
  addCommentSchema.parse(req);

  const { postId, body } = req;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  const newComment = new Comment({
    id: uuidv4(),
    postId,
    body,
    user: session?.user?.id,
  });
  await newComment.save();

  const post = await Post.findOneAndUpdate(
    { id: postId },
    { $inc: { commentCount: 1 } },
    { new: true }
  );
  await User.updateOne(
    { id: session?.user?.id },
    { $inc: { commentCount: 1 } }
  );

  revalidateTag("latest-posts");
  if (post) {
    revalidateTag(`${post.id}-post`);
    revalidateTag(`${post.id}-inital-comments`);
    revalidateTag(`${post.category}-latest-posts`);
  }

  return NextResponse.json({
    success: true,
    comment: { ...newComment.toObject(), user: session.user },
  });
});
