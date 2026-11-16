import React, { useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useArticles } from "@/hooks/useArticles";
import { NewsCard } from "@/components/NewsCard";
import { NewsSearch } from "@/components/NewsSearch";
import { ArrowLeft, Search as SearchIcon, RefreshCw } from "lucide-react";

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (!query.trim()) {
      navigate("/news", { replace: true });
    }
  }, [query, navigate]);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useArticles({
    search: query,
    limit: 10,
  });

  const allArticles = data ? data.pages.flatMap((page) => page.articles) : [];
  const totalCount = data?.pages[0]?.totalCount;

  const handleSearchUpdate = (newQuery: string) => {
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery.trim() });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
      {/* Return button */}
      <Link
        to="/news"
        className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-indigo hover:underline mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to All News</span>
      </Link>

      {/* Header & Search Input */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-bone/60 pb-8 mb-12">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-indigo font-bold block mb-1">
            Search Results
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
            &ldquo;{query}&rdquo;
          </h1>
          {totalCount !== undefined && !isLoading && (
            <span className="text-xs font-mono text-ink/70 mt-1 block">
              {totalCount} {totalCount === 1 ? "result" : "results"} found
            </span>
          )}
        </div>

        <NewsSearch initialValue={query} onSearchChange={handleSearchUpdate} />
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-bone/60 bg-white/50 p-6 animate-pulse">
              <div className="aspect-[16/9] w-full bg-bone/40 rounded-lg mb-4" />
              <div className="h-4 w-24 bg-bone/50 rounded mb-3" />
              <div className="h-6 w-full bg-bone/50 rounded mb-2" />
              <div className="h-4 w-3/4 bg-bone/40 rounded mb-4" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="p-12 text-center rounded-2xl border border-rose-200 bg-rose-50/40">
          <p className="text-sm font-mono text-rose-700 mb-4">
            {error instanceof Error ? error.message : "Search query failed."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-5 py-2 rounded-full bg-rose-600 text-white text-xs font-mono uppercase tracking-wider"
          >
            Retry Search
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && allArticles.length === 0 && (
        <div className="p-16 text-center rounded-2xl border border-bone/60 bg-white/40">
          <SearchIcon className="h-10 w-10 text-ink/40 mx-auto mb-3" />
          <h3 className="font-display text-xl font-bold text-ink mb-2">
            No articles found for &ldquo;{query}&rdquo;
          </h3>
          <p className="font-body text-base text-ink/70 max-w-md mx-auto mb-6">
            Try checking for spelling errors, using simpler keywords, or browsing by category.
          </p>
          <Link
            to="/news"
            className="px-5 py-2.5 rounded-full bg-indigo text-paper text-xs font-mono uppercase tracking-wider"
          >
            Explore News Feed
          </Link>
        </div>
      )}

      {/* Results Grid */}
      {!isLoading && !isError && allArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      {hasNextPage && (
        <div className="py-12 flex justify-center">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-bone/80 bg-white text-xs font-mono uppercase tracking-wider text-ink hover:border-indigo"
          >
            {isFetchingNextPage && <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo" />}
            <span>{isFetchingNextPage ? "Loading more..." : "Load more results"}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
