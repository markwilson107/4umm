import Link from "next/link";
import { ICategory } from "@/types/category";
import categoryIcons from "@/config/categoryIcons";

type Props = {
  params?: Promise<{ id: string }>;
  categories: ICategory[];
};

async function SideMenu({ params, categories }: Props) {
  let categoryId = "";
  if (params) {
    const { id } = await params;
    categoryId = id;
  }

  return (
    <aside className="flex flex-col w-[300px] p-6 gap-3 bg-sideMenu border-r border-border max-lg:hidden">
      <h1 className="text-xl font-semibold">Categories</h1>
      {categories.map((category) => (
        <Link
          key={`side-menu-${category.id}`}
          href={`/category/${category.id}`}
          className={`flex bg-background rounded-xl p-5 group hover:bg-theme hover:text-textSecondary ${
            categoryId === category.id ? "!text-textSecondary !bg-theme" : ""
          }`}
        >
          <div
            className={`flex items-center justify-center w-[40px] h-[40px] rounded-full mr-4 group-hover:!bg-background text-background group-hover:text-theme  ${
              categoryId === category.id ? "!text-theme !bg-background" : ""
            }`}
            style={{ background: categoryIcons[category.id]?.color }}
          >
            {categoryIcons[category.id]?.icon}
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold leading-none mt-0.5">{category.title}</h2>
            <p
              className={`text-textLight group-hover:text-textSecondary text-sm mt-1 leading-none ${
                categoryId === category.id ? "!text-textSecondary" : ""
              }`}
            >{`${category.postCount} posts`}</p>
          </div>
        </Link>
      ))}
    </aside>
  );
}

export default SideMenu;
