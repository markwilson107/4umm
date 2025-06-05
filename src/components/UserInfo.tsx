"use client";

import Avatar from "boring-avatars";
import categoryIcons from "@/config/categoryIcons";
import { IPost } from "@/types/post";
import timeAgoFromDate from "@/utils/timeAgoFromDate";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { IComment } from "@/types/comment";

function UserInfo({
  data,
  clickable = false,
}: {
  data?: IPost | IComment;
  clickable?: boolean;
}) {
  const session = useSession();
  const isCurrentUser = session?.data?.user.username === data?.user.username;

  function Inner() {
    return (
      <>
        <Avatar
          size={34}
          name={
            isCurrentUser ? session?.data?.user.username : data?.user.username
          }
          variant={
            isCurrentUser
              ? session?.data?.user.avatar
              : data?.user.avatar || "marble"
          }
          colors={Object.keys(categoryIcons).map((c) => categoryIcons[c].color)}
        />
        <h3 className="font-semibold">
          {isCurrentUser ? session?.data?.user.username : data?.user.username}
        </h3>
      </>
    );
  }

  const query: any = { modal: isCurrentUser ? "profile" : "user" };
  if (!isCurrentUser) query["user"] = data?.user.username;
  return (
    <div className="flex gap-3 items-center text-gray-500">
      <div className="flex gap-3 items-center text-gray-500">
        {clickable ? (
          <Link
            href={{
              query,
            }}
            className="flex gap-3 items-center text-gray-500"
          >
            <Inner />
          </Link>
        ) : (
          <div className="flex gap-3 items-center text-gray-500">
            <Inner />
          </div>
        )}
      </div>
      <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
      <p className="text-sm">{timeAgoFromDate(data?.createdAt)}</p>
    </div>
  );
}

export default UserInfo;
