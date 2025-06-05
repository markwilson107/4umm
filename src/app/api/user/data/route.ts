import dbConnect from "@/lib/dbConnect";
import tryWrapResponse from "@/utils/tryWrapResponse";
import { NextRequest, NextResponse } from "next/server";
import { userDataSchema } from "@/validation/userSchemas";
import User from "@/models/User";

export const POST = tryWrapResponse(async (request: NextRequest) => {
  const req = await request.json();
  userDataSchema.parse(req);

  const { username } = req;

  await dbConnect();

  const user = await User.findOne({ username });

  return NextResponse.json({ success: true, user: user?.sanitizeSafe() });
});
