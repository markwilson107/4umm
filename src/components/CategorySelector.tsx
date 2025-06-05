import categoryIcons from "@/config/categoryIcons";
import { ICategory } from "@/types/category";
import Link from "next/link";

type Props = {
  params?: { id: string };
  categories: ICategory[];
};

async function CategorySelector({ params, categories }: Props) {
  let categoryId = "";
  if (params) {
    const { id } = await params;
    categoryId = id;
  }

  return (
    <div className="flex w-full overflow-x-auto lg:hidden pb-2 mb-2 gap-1">
      {categories.map((c) => (
        <Link
        key={`category-selector-${c.id}`}
          href={`/category/${c.id}`}
          className={`flex items-center justify-center gap-2 text-center px-2 py-1.5 rounded-full text-textSecondary text-sm min-w-[110px] font-semibold ${categoryId !== "" && categoryId !== c.id ? "opacity-60" : ""}`}
          style={{ background: categoryIcons[c.id]?.color }}
        >
            {categoryIcons[c.id]?.icon}
          {c.title}
        </Link>
      ))}
    </div>
  );
}

export default CategorySelector;
