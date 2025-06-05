import CreateForm from "@/components/CreateForm";
import PageWrapper from "@/components/PageWrapper";
import dbConnect from "@/lib/dbConnect";
import { getCategories } from "@/services/categoryService";
import { ICategory } from "@/types/category";

type Props = {};

async function CreatePage({}: Props) {
  let categories: ICategory[] = [];

  try {
    await dbConnect();
    const categoryDocs = await getCategories();

    categories = categoryDocs;
  } catch (err) {
    console.error("Failed to fetch posts:", err);
  }
  return (
    <PageWrapper categories={categories}>
      <CreateForm categories={categories} />
    </PageWrapper>
  );
}

export default CreatePage;
