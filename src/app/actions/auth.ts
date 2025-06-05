"use server";

import dbConnect from "@/lib/dbConnect";
import { registerSchema, updateProfileSchema } from "@/validation/authSchemas";
import { RegisterInput, UpdateProfileInput } from "@/types/auth";
import User from "@/models/User";

export async function register(formData: FormData) {
  const validatedInput = registerSchema.safeParse(formData);
  if (!validatedInput.success) {
    return {
			success: false,
			errors: validatedInput.error.flatten().fieldErrors
		}
  }
  const { username, email, avatar, password } = validatedInput.data;

  await dbConnect();

  const emailExists = await User.findOne({ email });

  if (emailExists) {
    // throw new ServerError("Email already exists", ["email"]);
  }

  const newUser = new User({ username, email, password, avatar });
  await newUser.save();

  return { success: true };
}

export async function updateProfile(input: UpdateProfileInput) {
  const validatedInput = updateProfileSchema.parse(input);
  const { username, email, avatar, newPassword, currentPassword } =
    validatedInput;

  await dbConnect();

  const emailExists = await User.findOne({ email });

  if (emailExists) {
    return { success: false, message: "Email is taken, try another one" };
  }

  const usernameExists = await User.findOne({ username });

  if (usernameExists) {
    return { success: false, message: "Username is taken, try another one" };
  }

  // const newUser = new User({ username, email, password, avatar });
  // await newUser.save();

  return { success: true };
}
