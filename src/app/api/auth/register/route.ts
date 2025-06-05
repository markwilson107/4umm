import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { ErrorResponse } from "@/types/error";
import tryWrapResponse from "@/utils/tryWrapResponse";
import { registerSchema } from "@/validation/authSchemas";
import { NextRequest, NextResponse } from "next/server";

export const POST = tryWrapResponse(async (request: NextRequest) => {
  const req = await request.json();
  registerSchema.parse(req);

  const { username, email, avatar, password } = req;

  await dbConnect();

  const usersExisting = await User.find({ $or: [{ username }, { email }] });

  if (usersExisting.length > 0) {
    const errorResponse = new ErrorResponse("User already exists");
    if (usersExisting.some(u => u.email === email)) {
      errorResponse.issues["email"] = ["Email already exists"];
    }
    if (usersExisting.some(u => u.username === username)) {
      errorResponse.issues["username"] = ["Username already exists"];
    }
    throw errorResponse;
  }

  const newUser = new User({ username, email, avatar, password });
  await newUser.save();

  return NextResponse.json({ success: true });
});
