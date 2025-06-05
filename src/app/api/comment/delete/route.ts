import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import tryWrapResponse from "@/utils/tryWrapResponse";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { deleteCommentSchema } from "@/validation/commentSchemas";
import Comment from "@/models/Comment";
import { revalidateTag } from "next/cache";
import User from "@/models/User";
import { authOptions } from "../../auth/utils/authOptions";

export const POST = tryWrapResponse(async (request: NextRequest) => {
  const req = await request.json();
  deleteCommentSchema.parse(req);

  const { id } = req;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  await Comment.deleteOne({ id, user: session?.user?.id });

  const post = await Post.findOneAndUpdate(
    { id },
    { $inc: { commentCount: -1 } },
    { new: true }
  );
  await User.updateOne(
    { id: session?.user?.id },
    { $inc: { commentCount: -1 } }
  );

  revalidateTag("latest-posts");
  if (post) revalidateTag(`${post.category}-latest-posts`);

  return NextResponse.json({ success: true });
});
