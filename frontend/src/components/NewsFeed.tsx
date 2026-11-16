import React, { useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useArticles, useNewArticlesPoll } from "@/hooks/useArticles";
import { NewsCard } from "./NewsCard";
import { NewsFilters } from "./NewsFilters";
import { NewsSearch } from "./NewsSearch";
import { Category, Article } from "@/types/article";
import { RefreshCw, AlertCircle, CheckCircle2, Filter, ChevronDown, Sparkles, ArrowUp } from "lucide-react";

export const NewsFeed: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get("category") || "All";
  const sourceParam = searchParams.get("source") || "All";
  const searchParam = searchParams.get("search") || "";

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
    category: categoryParam,
    source: sourceParam,
    search: searchParam,
    limit: 10,
  });

  // Deduplicate articles across pages
  const allArticles = useMemo(() => {
    if (!data) return [];
    const flattened = data.pages.flatMap((page) => page.articles);
    const seen = new Set<string>();
    const unique: Article[] = [];

    for (const art of flattened) {
      const key = String(art.id);
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(art);
      }
    }
    return unique;
  }, [data]);

  const topArticleId = allArticles[0]?.id;

  // 5-minute background polling for new articles
  const { hasNewArticles, dismissNewArticles } = useNewArticlesPoll(topArticleId, {
    category: categoryParam,
    source: sourceParam,
    search: searchParam,
  });

  // Infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "250px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCategorySelect = (category: Category) => {
    setSearchParams((prev) => {
      const current = prev.get("category") || "All";
      if (current.toLowerCase() === category.toLowerCase()) return prev;
      const next = new URLSearchParams(prev);
      if (category === "All") {
        next.delete("category");
      } else {
        next.set("category", category);
      }
      return next;
    });
  };

  const handleSourceSelect = (source: string) => {
    setSearchParams((prev) => {
      const current = prev.get("source") || "All";
      if (current === source) return prev;
      const next = new URLSearchParams(prev);
      if (source === "All") {
        next.delete("source");
      } else {
        next.set("source", source);
      }
      return next;
    });
  };

  const handleSearchChange = (query: string) => {
    setSearchParams((prev) => {
      const current = prev.get("search") || "";
      const trimmed = query.trim();
      if (current === trimmed) return prev;
      const next = new URLSearchParams(prev);
      if (trimmed) {
        next.set("search", trimmed);
      } else {
        next.delete("search");
      }
      return next;
    }, { replace: true });
  };

  const handleRefreshNew = () => {
    dismissNewArticles();
    window.scrollTo({ top: 0, behavior: "smooth" });
    refetch();
  };

  const availablePublishers = [
    "All",
    "MIT Technology Review",
    "TechCrunch",
    "The Verge",
    "Wired",
    "Reuters",
    "arXiv",
    "VentureBeat",
    "Nature",
  ];

  return (
    <div className="space-y-8">
      {/* 5-Minute Polling New Articles Notification Banner */}
      {hasNewArticles && (
        <div className="sticky top-24 z-30 flex justify-center py-2 animate-bounce">
          <button
            type="button"
            onClick={handleRefreshNew}
            className="inline-flex items-center gap-2 rounded-full bg-indigo px-5 py-2 text-xs font-mono font-semibold uppercase tracking-wider text-paper shadow-lg hover:bg-indigoDeep transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-pulse" />
            <span>New dispatches available — Click to update</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Controls: Search & Publisher Dropdown */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-bone/60 pb-6">
        <NewsSearch
          initialValue={searchParam}
          onSearchChange={handleSearchChange}
        />

        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="publisher-select" className="flex items-center gap-1.5 text-xs font-mono text-ink/70">
            <Filter className="h-3.5 w-3.5" />
            <span>Source:</span>
          </label>
          <div className="relative">
            <select
              id="publisher-select"
              value={sourceParam}
              onChange={(e) => handleSourceSelect(e.target.value)}
              className="appearance-none rounded-lg border border-bone/80 bg-white/80 py-1.5 pl-3 pr-8 text-xs font-mono text-ink shadow-sm focus:border-indigo focus:outline-none cursor-pointer"
            >
              {availablePublishers.map((pub) => (
                <option key={pub} value={pub}>
                  {pub === "All" ? "All Publishers" : pub}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink/50" />
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <NewsFilters
        selectedCategory={categoryParam}
        onSelectCategory={handleCategorySelect}
      />

      {/* Active Search & Filter feedback */}
      {(searchParam || sourceParam !== "All") && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-ink/70 bg-white/50 p-3 rounded-lg border border-bone/60">
          <div className="flex items-center gap-2">
            <span>Filtering by:</span>
            {searchParam && <strong>&ldquo;{searchParam}&rdquo;</strong>}
            {searchParam && sourceParam !== "All" && <span>•</span>}
            {sourceParam !== "All" && <span>Source: <strong>{sourceParam}</strong></span>}
          </div>
          <button
            type="button"
            onClick={() => {
              const next = new URLSearchParams(searchParams);
              next.delete("search");
              next.delete("source");
              setSearchParams(next);
            }}
            className="text-indigo hover:underline font-semibold"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-bone/60 bg-white/50 p-6 animate-pulse">
              <div className="aspect-[16/9] w-full bg-bone/40 rounded-lg mb-4" />
              <div className="h-4 w-24 bg-bone/50 rounded mb-3" />
              <div className="h-6 w-full bg-bone/50 rounded mb-2" />
              <div className="h-4 w-3/4 bg-bone/40 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-bone/30 rounded" />
                <div className="h-3 w-5/6 bg-bone/30 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State with Retry */}
      {isError && (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-rose-200 bg-rose-50/40">
          <AlertCircle className="h-8 w-8 text-rose-600 mb-2" />
          <h3 className="font-display text-lg font-bold text-rose-900 mb-1">
            Unable to load news feed
          </h3>
          <p className="text-xs font-mono text-rose-700 max-w-sm mb-4">
            {error instanceof Error ? error.message : "Connection failed while querying articles."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider text-white hover:bg-rose-700 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Feed</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && allArticles.length === 0 && (
        <div className="flex flex-col items-center justify-center p-16 text-center rounded-2xl border border-bone/60 bg-white/40">
          <h3 className="font-display text-xl font-bold text-ink mb-2">
            No articles match your criteria
          </h3>
          <p className="font-body text-base text-ink/70 max-w-md mb-6">
            Try adjusting your category selection, removing the search keyword, or resetting the publisher filter.
          </p>
          {(categoryParam !== "All" || searchParam || sourceParam !== "All") && (
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="rounded-full bg-indigo px-5 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider text-paper hover:bg-indigoDeep transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Responsive Grid: 1 col mobile, 2 tablet, 3 desktop */}
      {!isLoading && !isError && allArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Infinite Scroll Sentinel */}
      {!isLoading && !isError && allArticles.length > 0 && (
        <div ref={sentinelRef} className="py-12 flex flex-col items-center justify-center">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-xs font-mono text-ink/70">
              <RefreshCw className="h-4 w-4 animate-spin text-indigo" />
              <span>Fetching additional dispatches...</span>
            </div>
          )}

          {!hasNextPage && (
            <div className="inline-flex items-center gap-2 rounded-full border border-bone bg-white/80 px-4 py-2 text-xs font-mono text-ink/70 shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>You&apos;re up to date with the latest stories</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
