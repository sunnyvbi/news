import React from "react";
import { Bookmark } from "lucide-react";
import { useSavedArticles } from "@/hooks/useSavedArticles";

interface BookmarkButtonProps {
  articleId: string | number;
  className?: string;
  showText?: boolean;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  articleId,
  className = "",
  showText = false,
}) => {
  const { isSaved, toggleSave } = useSavedArticles();
  const idStr = String(articleId);
  const saved = isSaved(idStr);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleSave(idStr);
      }}
      title={saved ? "Remove bookmark" : "Save article"}
      aria-label={saved ? "Remove bookmark" : "Save article"}
      className={`inline-flex items-center gap-1.5 rounded-md p-1.5 text-xs font-mono transition-colors ${
        saved
          ? "text-indigo bg-indigo/10"
          : "text-ink/60 hover:text-ink hover:bg-bone/40"
      } ${className}`}
    >
      <Bookmark className={`h-4 w-4 ${saved ? "fill-indigo" : ""}`} />
      {showText && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
};

export default BookmarkButton;
