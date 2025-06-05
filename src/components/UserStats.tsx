import { IUser } from "@/types/user";

function UserStats({
  user,
  className,
}: {
  user?: Partial<IUser>;
  className?: string;
}) {
  const loading = !user;
  return (
    <div
      className={`flex w-full border border-border rounded-lg ${
        className || ""
      }`}
    >
      <div className="flex items-center flex-1 flex-col p-2 gap-1 border-r border-border">
        <div className="font-semibold text-gray-500">Posts</div>
        {loading ? "Loading..." : user?.postCount }
      </div>
      <div className="flex items-center flex-1 flex-col p-2 gap-1">
        <div className="font-semibold text-gray-500">Comments</div>
        {loading ? "Loading..." : user?.commentCount}
      </div>
    </div>
  );
}

export default UserStats;
