import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import tryWrapResponse from "@/utils/tryWrapResponse";
import { loadMorePostsSchema } from "@/validation/postSchemas";
import { NextRequest, NextResponse } from "next/server";

export const POST = tryWrapResponse(async (request: NextRequest) => {
  const req = await request.json();
  loadMorePostsSchema.parse(req);

  const { page, category } = req;

  await dbConnect();

  const query = category === "latest" ? {} : { category };

  const [total, posts] = await Promise.all([
    Post.countDocuments(query),
    Post.findAndPopulate(query, {
      sort: { createdAt: -1 },
      skip: (page - 1) * 10,
      limit: 10,
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: posts,
    hasNext: page * 10 < total,
  });
});
