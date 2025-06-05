import { IPost } from "@/types/post";
import Link from "next/link";
import CategoryPill from "./CategoryPill";
import CommentCount from "./CommentCount";
import UserInfo from "./UserInfo";

type Props = {
  post: IPost;
};

function Post({ post }: Props) {
  return (
    <Link
      href={`/post/${post.id}`}
      className="flex flex-col border-b border-border"
    >
      <div className="flex flex-col py-3 px-3 hover:bg-gray-50 cursor-pointer select-none rounded-lg">
        <div className="flex">
          <div className="flex flex-col">
            <h2 className="w-full text-lg font-semibold">
              {post.title}
            </h2>
            <p className="overflow-hidden line-clamp-2 mt-1 mb-4 text-gray-500">
              {post.body}
            </p>
          </div>
          <div className="flex-shrink-0 items-end pb-2 px-2 hidden sm:flex">
            <CategoryPill categoryId={post.category} />
          </div>
        </div>
        <div className="flex flex-col-reverse justify-between pr-5 text-gray-500 sm:flex-row">
          <UserInfo data={post} />
          <div className="flex gap-3 items-center mb-3 sm:mb-0">
            <CategoryPill categoryId={post.category} className="sm:hidden" />
            <CommentCount count={post.commentCount} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Post;
