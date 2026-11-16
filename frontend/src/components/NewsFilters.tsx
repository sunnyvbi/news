import React from "react";
import { CATEGORIES, Category } from "@/types/article";

interface NewsFiltersProps {
  selectedCategory: string;
  onSelectCategory: (category: Category) => void;
}

export const NewsFilters: React.FC<NewsFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const isSelected =
          (selectedCategory === "" && cat === "All") ||
          selectedCategory.toLowerCase() === cat.toLowerCase();

        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-all ${
              isSelected
                ? "bg-indigo text-paper font-semibold shadow-sm"
                : "bg-white/60 text-ink/75 hover:bg-bone/50 hover:text-ink border border-bone/60"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

export default NewsFilters;
