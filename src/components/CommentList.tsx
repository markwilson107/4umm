"use client";

import { IPost } from "@/types/post";
import CommentForm from "./CommentForm";
import { CommentResponse, IComment } from "@/types/comment";
import { useInfiniteScroll } from "@/hook/useInfiniteScroll";
import Comment from "./Comment";

type Props = {
  post?: IPost;
  initalComments?: CommentResponse;
};

function CommentList({ post, initalComments }: Props) {
  const loadComments = async ({ page }: { page: number }) => {
    const response = await fetch("/api/comment/load", {
      method: "POST",
      body: JSON.stringify({ id: post?.id, page }),
    });

    const responseData = await response.json();
    return responseData;
  };

  const {
    items: comments,
    loaderRef,
    loading,
    appendItem,
  } = useInfiniteScroll<IComment>(loadComments, initalComments);

  return (
    <div className="flex flex-col">
      <CommentForm post={post} callback={appendItem} />
      {comments.length === 0 ? <div className=" py-5 text-gray-500">There are no comments yet</div> : comments.map((c) => (
        <Comment key={`comment-${c.id}`} comment={c} />
      ))}
      <div className="w-full text-center h-10" ref={loaderRef}>
        {loading ? "Loading..." : ""}
      </div>
    </div>
  );
}

export default CommentList;
