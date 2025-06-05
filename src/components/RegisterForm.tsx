"use client";

import { useState } from "react";
import InputField from "./Input";
import Button from "./Button";
import { registerSchema } from "@/validation/authSchemas";
import { formatErrors } from "@/utils/formatErrors";
import { signIn } from "@/services/authService";
import { RegisterInput } from "@/types/auth";
import { ErrorResponseIssues } from "@/types/error";
import AvatarSelect from "./AvatarSelect";

type Props = {
  closeCallback: () => void;
};

function RegisterForm({ closeCallback }: Props) {
  const [avatar, setAvatar] = useState<RegisterInput["avatar"]>("marble");
  const [username, setUsername] = useState<RegisterInput["username"]>("");
  const [email, setEmail] = useState<RegisterInput["email"]>("");
  const [password, setPassword] = useState<RegisterInput["password"]>("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorResponseIssues>({});

  async function onSubmit(e: any) {
    e.preventDefault();
    if (loading) return;
    const result = registerSchema.safeParse({
      username,
      email,
      password,
      avatar,
    });
    if (!result.success) {
      const formattedErrors = formatErrors(result.error);
      return setErrors(formattedErrors);
    }
    if (password !== confirmPassword)
      return setErrors({
        confirmPassword: ["Passwords do not match"],
      });
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ ...result.data }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        await signIn({ email, password });
      } else {
        if (responseData.issues) setErrors(responseData.issues);
      }
    } catch (error: any) {
      setErrors({ other: ["Network error"] });
      console.log(error);
    }

    setLoading(false);
  }

  function onChange(value: string, set: Function) {
    setErrors({});
    set(value);
  }
  return (
    <form className="flex flex-col w-full gap-3" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold mb-1">Register</h1>
      <AvatarSelect seed={username} setAvatar={setAvatar} avatar={avatar} />
      <InputField
        id="username"
        label="Username"
        value={username}
        onChange={(e) => onChange(e.target.value, setUsername)}
        placeholder="Username"
        errors={errors}
      />
      <InputField
        id="email"
        label="Email"
        value={email}
        onChange={(e) => onChange(e.target.value, setEmail)}
        placeholder="Email"
        errors={errors}
      />
      <InputField
        id="password"
        label="Password"
        value={password}
        onChange={(e) => onChange(e.target.value, setPassword)}
        placeholder="Password"
        errors={errors}
        type="password"
      />
      <InputField
        id="confirmPassword"
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => onChange(e.target.value, setConfirmPassword)}
        placeholder="Confirm password"
        errors={errors}
        type="password"
      />
      <div className="flex justify-end gap-2 mt-5">
        <Button className="w-[90px]" size="sm" type="submit" disabled={loading}>
          {loading ? "Loading" : "Submit"}
        </Button>
        <Button
          className="w-[90px]"
          size="sm"
          variant="secondary"
          onClick={closeCallback}
        >
          Close
        </Button>
      </div>
    </form>
  );
}

export default RegisterForm;
