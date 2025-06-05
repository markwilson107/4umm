"use client";

import { useEffect, useState } from "react";
import InputField from "./Input";
import Button from "./Button";
import { updateProfileSchema } from "@/validation/authSchemas";
import { formatErrors } from "@/utils/formatErrors";
import { RegisterInput } from "@/types/auth";
import { signOut, useSession } from "next-auth/react";
import AvatarSelect from "./AvatarSelect";
import { IUser } from "@/types/user";
import { fetchUserData } from "@/services/userServices";
import UserStats from "./UserStats";

type Props = {
  closeCallback: () => void;
};

function ProfileForm({ closeCallback }: Props) {
  const [avatar, setAvatar] = useState<RegisterInput["avatar"]>("marble");
  const [username, setUsername] = useState<RegisterInput["username"]>("");
  const [email, setEmail] = useState<RegisterInput["email"]>("");
  const [currentPassword, setCurrentPassword] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [initalised, setInitalised] = useState(false);
  const [userData, setUserData] = useState<Partial<IUser>>();
  const session = useSession();

  async function fetchUser() {
    const userDataRes = await fetchUserData(session.data!.user.username);
    if (userDataRes?.success) {
      setUserData(userDataRes.user);
    }
  }

  useEffect(() => {
    if (session?.data?.user && !initalised) {
      setAvatar(session.data.user.avatar);
      setUsername(session.data.user.username);
      setEmail(session.data.user.email);
      fetchUser();
      setInitalised(true);
    }
  }, [session]);

  async function onSubmit(e: any) {
    e.preventDefault();
    if (loading) return;
    const result = updateProfileSchema.safeParse({
      avatar,
      username,
      email,
      currentPassword,
      newPassword,
    });
    if (!result.success) {
      const formattedErrors = formatErrors(result.error);
      return setErrors(formattedErrors);
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/update", {
        method: "POST",
        body: JSON.stringify({
          ...result.data,
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        await session.update();
        closeCallback();
      } else {
        if (responseData.issues) setErrors(responseData.issues);
      }
    } catch (err: any) {
      if (err.message)
        setErrors({
          other: [err.message],
        });
      console.error(err);
    }

    setLoading(false);
  }

  function onChange(value: any, set: Function) {
    setErrors({});
    set(value);
  }
  return (
    <form className="flex flex-col w-full gap-3" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold mb-1">Profile</h1>
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
      <div className="w-full border-b border-border my-1"></div>
      <InputField
        id="currentPassword"
        label="Current Password"
        value={currentPassword || ""}
        onChange={(e) =>
          onChange(
            e.target.value.trim() === "" ? null : e.target.value,
            setCurrentPassword
          )
        }
        placeholder="Current password"
        errors={errors}
      />
      <InputField
        id="password"
        label="New Password"
        value={newPassword || ""}
        onChange={(e) =>
          onChange(
            e.target.value.trim() === "" ? null : e.target.value,
            setNewPassword
          )
        }
        placeholder="New password"
        errors={errors}
      />
      <UserStats user={userData} className="my-3" />
      <Button
        className="w-[100px] border-red-500 !text-red-500"
        size="sm"
        type="submit"
        variant="outline"
        onClick={() => signOut()}
      >
        Sign out
      </Button>
      {/* <InputField
        id="password"
        value={password}
        onChange={(e) => onChange(e.target.value, setPassword)}
        placeholder="Password"
        errors={errors}
      />
      <InputField
        id="confirmPassword"
        value={confirmPassword}
        onChange={(e) => onChange(e.target.value, setConfirmPassword)}
        placeholder="Confirm password"
        errors={errors}
      /> */}
      <div className="flex justify-end gap-2 mt-3 w-full">
        <Button className="w-[90px]" size="sm" type="submit" disabled={loading}>
          {loading ? "Loading" : "Update"}
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

export default ProfileForm;
