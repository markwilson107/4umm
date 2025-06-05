import { ReactNode } from "react";
import SideMenu from "./SideMenu";
import { ICategory } from "@/types/category";
import CategorySelector from "./CategorySelector";

type Props = {
  children: ReactNode;
  categories: ICategory[];
  params?: { id: string };
};

function PageWrapper({ children, categories, params }: Props) {
  return (
    <div className="flex flex-1 overflow-y-auto">
      <SideMenu params={params} categories={categories} />
      <section className="flex flex-1 justify-center  overflow-x-hidden">
        <div className="w-full max-w-[750px] p-3 pt-5 sm:p-6">
          <CategorySelector params={params} categories={categories} />
          {children}
        </div>
      </section>
    </div>
  );
}

export default PageWrapper;
