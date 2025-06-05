import CategoryPill from "@/components/CategoryPill";
import CommentCount from "@/components/CommentCount";
import CommentList from "@/components/CommentList";
import PageWrapper from "@/components/PageWrapper";
import UserInfo from "@/components/UserInfo";
import dbConnect from "@/lib/dbConnect";
import { getCategories } from "@/services/categoryService";
import { getInitalComments } from "@/services/commentService";
import { getPost } from "@/services/postService";
import { ICategory } from "@/types/category";
import { CommentResponse } from "@/types/comment";
import { IPost } from "@/types/post";

type Props = {
  params: { id: string };
};

async function PostPage({ params }: Props) {
  const { id } = await params;
  let post: IPost | undefined;
  let categories: ICategory[] = [];
  let comments: CommentResponse = {
    hasNext: false,
    data: [],
  };

  try {
    await dbConnect();

    const [categoryDocs, postDoc, commentDocs] = await Promise.all([
      getCategories(),
      getPost(id),
      getInitalComments(id),
    ]);

    post = postDoc;
    categories = categoryDocs;
    comments = commentDocs;

  } catch (err) {
    console.error("Failed to fetch posts:", err);
  }

  return (
    <PageWrapper categories={categories}>
      <UserInfo data={post} clickable={true} />
      <h2 className="w-full text-lg font-semibold mt-3">{post?.title}</h2>
      <p className="mt-2">{post?.body}</p>
      <div className="flex gap-3 items-center my-4">
        <CategoryPill categoryId={post?.category} />
        {/* <CommentCount count={post?.commentCount || 0} /> */}
      </div>
      <div className="border-b border-border my-5"></div>
      <CommentList post={post} initalComments={comments} />
    </PageWrapper>
  );
}

export default PostPage;
