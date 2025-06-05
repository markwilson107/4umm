import CommentIcon from "@/assets/comment";

function CommentCount({ count }: { count: number }) {
  return (
    <div className="flex gap-2 items-center text-sm text-gray-500">
      <CommentIcon width={17} height={17} />
      {count}
    </div>
  );
}

export default CommentCount;
