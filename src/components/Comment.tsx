import { IComment } from "@/types/comment";
import UserInfo from "./UserInfo";

type Props = {
  comment: IComment;
};

function Comment({ comment }: Props) {
  return (
    <div
      className="flex flex-col mb-4"
    >
      <UserInfo data={comment} clickable={true} />
      <p className="ml-11">{comment.body}</p>
    </div>
  );
}

export default Comment;
