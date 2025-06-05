import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { ErrorResponse } from "@/types/error";
import tryWrapResponse from "@/utils/tryWrapResponse";
import { updateProfileSchema } from "@/validation/authSchemas";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";

export const POST = tryWrapResponse(async (request: NextRequest) => {
  const req = await request.json();
  updateProfileSchema.parse(req);

  const { username, email, avatar, currentPassword, newPassword } = req;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  const userExists = await User.findOne({ id: session.user.id });

  if (!userExists) {
    throw new Error("User does not exist");
  }

  if (newPassword) {
    if (!userExists.comparePassword(currentPassword) || !currentPassword) {
      throw new ErrorResponse("Password is incorrect", {
        currentPassword: ["Password is incorrect"],
      });
    }
  }

  let checkUsername = userExists.username !== username;
  let checkEmail = userExists.email !== email;

  if (checkUsername || checkEmail) {
    const usersExisting = await User.find({ $or: [{ username }, { email }] });
    if (usersExisting) {
      let throwError = false;
      const errorResponse = new ErrorResponse("User already exists");
      if (checkEmail && usersExisting.some((u) => u.email === email)) {
        errorResponse.issues["email"] = ["Email already exists"];
        throwError = true;
      }
      if (checkUsername && usersExisting.some((u) => u.username === username)) {
        errorResponse.issues["username"] = ["Username already exists"];
        throwError = true;
      }
      if (throwError) throw errorResponse;
    }
  }

  const update: any = { username, email, avatar };
  if (newPassword) update.password = newPassword;

  await User.updateOne({ id: session.user.id }, { $set: update });

  return NextResponse.json({ success: true });
});
