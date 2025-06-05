import categoryIcons from "@/config/categoryIcons";

type Props = {
  categoryId?: string;
  className?: string;
};

function CategoryPill({ categoryId, className = "" }: Props) {
  return (
    <div
      className={`px-3 py-1 text-textSecondary text-xs rounded-full ${className}`}
      style={{
        background: categoryIcons[categoryId || "general"]?.color || "gray",
      }}
    >
      {categoryId}
    </div>
  );
}

export default CategoryPill;
