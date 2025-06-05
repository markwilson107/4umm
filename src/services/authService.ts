import { RegisterInput } from "@/types/auth";
import { signIn as signInNextAuth } from "next-auth/react";

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const url = new URL(window.location.href);
  url.search = "";
  const callbackUrl = url.toString();
  return await signInNextAuth("email", {
    redirect: true,
    callbackUrl,
    email,
    password,
  });
}

export async function register(input: RegisterInput) {

}
