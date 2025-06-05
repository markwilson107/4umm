"use client";

import Link from "next/link";
import Button from "./Button";
import Modals from "./Modals";
import Avatar from "boring-avatars";
import categoryIcons from "@/config/categoryIcons";
import { useSession } from "next-auth/react";
import AddIcon from "@/assets/add";

function UserProfile() {
  const session = useSession();
  return (
    <div>
      {session?.data?.user ? (
        <div className="flex gap-5 text-textSecondary items-center">
          <Link className="flex gap-1.5 items-center" href="/create">
            <AddIcon width={17} height={17} /> Create post
          </Link>
          <Link
            href={{
              query: {
                modal: "profile",
              },
            }}
          >
            <Avatar
              size={38}
              name={session.data.user.username}
              variant={session.data.user.avatar || "marble"}
              colors={Object.keys(categoryIcons).map(
                (c) => categoryIcons[c].color
              )}
            />
          </Link>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            className="w-[100px]"
            href={{
              query: {
                modal: "login",
              },
            }}
            size="sm"
          >
            Login
          </Button>
          <Button
            className="w-[100px]"
            href={{
              query: {
                modal: "register",
              },
            }}
            size="sm"
            variant="secondary"
          >
            Register
          </Button>
        </div>
      )}
      <Modals />
    </div>
  );
}

export default UserProfile;
