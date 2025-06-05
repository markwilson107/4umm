import PageWrapper from "@/components/PageWrapper";
import PostList from "@/components/PostList";
import categoryIcons from "@/config/categoryIcons";
import { getCategories } from "@/services/categoryService";
import { getCategoryPosts } from "@/services/postService";
import { ICategory } from "@/types/category";
import { PostResponse } from "@/types/post";

type Props = {
  params: { id: string };
};

async function CategoryPage({ params }: Props) {
  const { id } = await params;
  let posts: PostResponse = { hasNext: false, data: [] };
  let categories: ICategory[] = [];

  try {
    const [categoryDocs, postDocs] = await Promise.all([
      getCategories(),
      getCategoryPosts(id),
    ]);

    posts = postDocs;
    categories = categoryDocs;
  } catch (err) {
    console.error("Failed to fetch posts:", err);
  }

  return (
    <PageWrapper params={params} categories={categories}>
      <h1 className="flex items-center gap-2 text-xl font-semibold px-3 pb-3 border-b border-border">
        {categoryIcons[id]?.icon}
        {categories.find((c) => c.id === id)?.title || id}
      </h1>
      <PostList initalPosts={posts} category={id} />
    </PageWrapper>
  );
}

export default CategoryPage;
