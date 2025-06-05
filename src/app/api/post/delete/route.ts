import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import tryWrapResponse from "@/utils/tryWrapResponse";
import { deletePostSchema } from "@/validation/postSchemas";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export const POST = tryWrapResponse(async (request: NextRequest) => {
  const req = await request.json();
  deletePostSchema.parse(req);

  const { id } = req;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  await Post.deleteOne({ id, user: session?.user?.id });

  return NextResponse.json({ success: true, id });
});
