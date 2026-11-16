import React from "react";
import { Link } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { fetchArticleById } from "@/lib/api";
import { useSavedArticles } from "@/hooks/useSavedArticles";
import { NewsCard } from "@/components/NewsCard";
import { Article } from "@/types/article";
import { Bookmark, BookmarkX, ArrowLeft, Trash2 } from "lucide-react";

export const SavedPage: React.FC = () => {
  const { savedIds, clearSaved } = useSavedArticles();

  // Batch query each saved article
  const queries = useQueries({
    queries: savedIds.map((id) => ({
      queryKey: ["quick-news-article", String(id)],
      queryFn: () => fetchArticleById(id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const articles = queries
    .map((q) => q.data)
    .filter((a): a is Article => Boolean(a));

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
      {/* Return button */}
      <Link
        to="/news"
        className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-indigo hover:underline mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to News Feed</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 border-b border-bone/60 pb-8 mb-12">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-indigo font-bold mb-1">
            <Bookmark className="h-3.5 w-3.5 fill-indigo" />
            <span>Saved Stories</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold text-ink tracking-tight">
            Reading List & Bookmarks
          </h1>
        </div>

        {savedIds.length > 0 && (
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-ink/70">
              {savedIds.length} {savedIds.length === 1 ? "article" : "articles"} stored
            </span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Are you sure you want to clear all saved articles?")) {
                  clearSaved();
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-rose-700 hover:text-rose-900 border border-rose-200 px-3 py-1.5 rounded-full hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Skeletons while loading */}
      {isLoading && savedIds.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: Math.min(savedIds.length, 6) }).map((_, i) => (
            <div key={i} className="rounded-xl border border-bone/60 bg-white/50 p-6 animate-pulse">
              <div className="aspect-[16/9] w-full bg-bone/40 rounded-lg mb-4" />
              <div className="h-4 w-24 bg-bone/50 rounded mb-3" />
              <div className="h-6 w-full bg-bone/50 rounded mb-2" />
              <div className="h-4 w-3/4 bg-bone/40 rounded mb-4" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && savedIds.length === 0 && (
        <div className="p-16 text-center rounded-2xl border border-bone/60 bg-white/40 max-w-2xl mx-auto">
          <BookmarkX className="h-12 w-12 text-ink/40 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-ink mb-2">
            You haven&apos;t saved any articles yet
          </h2>
          <p className="font-body text-base text-ink/70 mb-8 max-w-md mx-auto">
            Click the bookmark icon on any news card to add reports, papers, or dispatches to your reading list.
          </p>
          <Link
            to="/news"
            className="px-6 py-3 rounded-full bg-indigo text-paper font-display text-xs font-semibold uppercase tracking-wider hover:bg-indigoDeep transition-colors"
          >
            Browse News Feed
          </Link>
        </div>
      )}

      {/* Grid of Saved Articles */}
      {!isLoading && articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPage;
