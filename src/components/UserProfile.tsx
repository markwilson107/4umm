"use client";

import categoryIcons from "@/config/categoryIcons";
import { fetchUserData } from "@/services/userServices";
import { IUser } from "@/types/user";
import Avatar from "boring-avatars";
import { useEffect, useState } from "react";
import Button from "./Button";
import UserStats from "./UserStats";

type Props = {
  closeCallback: () => void;
  username: string | null;
};

function UserProfile({ closeCallback, username }: Props) {
  const [userData, setUserData] = useState<Partial<IUser>>();
  const [loading, setLoading] = useState<boolean>(true);
  async function fetchUser(user: string) {
    setLoading(true);
    const userDataRes = await fetchUserData(user);
    if (userDataRes?.success) {
      setUserData(userDataRes.user);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (username) {
      fetchUser(username);
    }
  }, [username]);

  return (
    <div className="flex flex-col items-center pt-2">
      <Avatar
        size={50}
        name={username || ""}
        variant={userData?.avatar}
        colors={
          loading
            ? ["#e8e8e8"]
            : Object.keys(categoryIcons).map((c) => categoryIcons[c].color)
        }
      />
      <h2 className="text-lg font-semibold mt-2">{username}</h2>
      <UserStats user={userData} className="my-3" />
      <div className="flex justify-end gap-2 mt-3 w-full">
        <Button
          className="w-[90px]"
          size="sm"
          variant="secondary"
          onClick={closeCallback}
        >
          Close
        </Button>
      </div>
    </div>
  );
}

export default UserProfile;
