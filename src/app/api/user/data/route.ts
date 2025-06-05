import tryWrapResponse from "@/utils/tryWrapResponse";
import { NextRequest, NextResponse } from "next/server";
import { userDataSchema } from "@/validation/userSchemas";
import { getUser } from "@/services/userCacheServices";

export const POST = tryWrapResponse(async (request: NextRequest) => {
  const req = await request.json();
  userDataSchema.parse(req);

  const { username } = req;

  const user = await getUser(username)

  return NextResponse.json({ success: true, user });
});
