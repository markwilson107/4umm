"use client";

import { useState } from "react";
import InputField from "./Input";
import Button from "./Button";
import { loginSchema } from "@/validation/authSchemas";
import { formatErrors } from "@/utils/formatErrors";
import { signIn } from "@/services/authService";

type Props = {
  closeCallback: () => void;
};

function LoginForm({ closeCallback }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  async function onSubmit(event: any) {
    event.preventDefault();
    if (loading) return;
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const formattedErrors = formatErrors(result.error);
      return setErrors(formattedErrors);
    }
    setLoading(true);
    setErrors({});

    const response = await signIn({ ...result.data });

    if (!response?.ok) {
      setErrors({
        other: ["Invalid credentials"],
      });
    }
    setLoading(false);
  }

  function onChange(value: string, set: Function) {
    setErrors({});
    set(value);
  }

  return (
    <form className="flex flex-col w-full gap-3" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold mb-3">Login</h1>
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
      />
      <div className="flex justify-end gap-2 mt-5">
        <Button className="w-[90px]" size="sm" type="submit" disabled={loading}>
          {loading ? "Loading" : "Update"}
        </Button>
        <Button
          className="w-[90px]"
          size="sm"
          variant="secondary"
          onClick={closeCallback}
          // href={{ query: { modal: null } }}
        >
          Close
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;
