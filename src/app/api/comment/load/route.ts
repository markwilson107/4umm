import dbConnect from "@/lib/dbConnect";
import tryWrapResponse from "@/utils/tryWrapResponse";
import { NextRequest, NextResponse } from "next/server";
import { loadCommentsSchema } from "@/validation/commentSchemas";
import Comment from "@/models/Comment";

export const POST = tryWrapResponse(async (request: NextRequest) => {
  const req = await request.json();
  loadCommentsSchema.parse(req);

  const { id, page } = req;

  await dbConnect();

  const [total, comments] = await Promise.all([
    Comment.countDocuments({ postId: id }),
    Comment.findAndPopulate(
      { postId: id },
      {
        sort: { createdAt: -1 },
        skip: (page - 1) * 10,
        limit: 10,
      }
    ),
  ]);

  return NextResponse.json({
    success: true,
    data: comments,
    hasNext: page * 10 < total,
  });
});
