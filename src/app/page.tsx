import PageWrapper from "@/components/PageWrapper";
import PostList from "@/components/PostList";
import { getCategories } from "@/services/categoryService";
import { getLatestPosts } from "@/services/postService";
import { PostResponse } from "@/types/post";
import { ICategory } from "@/types/category";

async function HomePage() {
  let posts: PostResponse = { hasNext: false, data: [] };
  let categories: ICategory[] = [];

  try {
    const [categoryDocs, postDocs] = await Promise.all([
      getCategories(),
      getLatestPosts(),
    ]);

    posts = postDocs;
    categories = categoryDocs;
  } catch (err) {
    console.error("Failed to fetch posts:", err);
  }

  return (
    <PageWrapper categories={categories}>
      <h1 className="text-xl font-semibold px-3 pb-3 border-b border-border">Latest</h1>
      <PostList initalPosts={posts} category="latest" />
    </PageWrapper>
  );
}

export default HomePage;
