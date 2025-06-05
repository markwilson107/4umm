"use client";

import { IPost, PostResponse } from "@/types/post";
import Post from "./Post";
import { useInfiniteScroll } from "@/hook/useInfiniteScroll";

type Props = {
  initalPosts: PostResponse;
  category: string;
};

function PostList({ initalPosts, category }: Props) {
  const loadPosts = async ({ page }: { page: number }) => {
    const response = await fetch("/api/post/load", {
      method: "POST",
      body: JSON.stringify({ category, page }),
    });

    const responseData = await response.json();
    return responseData;
  };

  const {
    items: posts,
    loaderRef,
    loading,
  } = useInfiniteScroll<IPost>(loadPosts, initalPosts);

  return (
    <div>
      {posts.length === 0 ? <div className="px-3 py-5 text-gray-500">There are no posts yet</div> : posts.map((post) => (
        <Post key={`${category}-${post.id}`} post={post} />
      ))}
      <div className="flex items-center justify-center w-full text-center h-14" ref={loaderRef}>
        {loading ? "Loading..." : ""}
      </div>
    </div>
  );
}

export default PostList;
