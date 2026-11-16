import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchArticles, fetchArticleById, fetchRelatedArticles } from "@/lib/api";
import { ArticlesQueryParams } from "@/types/article";
import { useState, useEffect } from "react";

export function useArticles(params: Omit<ArticlesQueryParams, "cursor"> & { source?: string }) {
  return useInfiniteQuery({
    queryKey: [
      "quick-news-articles",
      {
        category: params.category || "All",
        search: params.search || "",
        source: params.source || "All",
        limit: params.limit || 10,
      },
    ],
    queryFn: ({ pageParam = null }) =>
      fetchArticles({
        cursor: pageParam as string | null,
        limit: params.limit,
        category: params.category,
        search: params.search,
        source: params.source,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: null as string | null,
  });
}

export function useArticle(id: string | number | undefined) {
  return useQuery({
    queryKey: ["quick-news-article", String(id)],
    queryFn: () => {
      if (!id) throw new Error("Article ID is required");
      return fetchArticleById(id);
    },
    enabled: Boolean(id),
    retry: 1,
  });
}

export function useRelatedArticles(
  category: string | undefined,
  excludeId: string | number | undefined,
  limit: number = 3
) {
  return useQuery({
    queryKey: ["quick-news-related", category, String(excludeId), limit],
    queryFn: () => {
      if (!category || !excludeId) return [];
      return fetchRelatedArticles(category, excludeId, limit);
    },
    enabled: Boolean(category && excludeId),
  });
}

/**
 * Polls page 1 every 5 minutes to detect new incoming stories.
 */
export function useNewArticlesPoll(
  currentTopArticleId: string | number | undefined,
  params: Omit<ArticlesQueryParams, "cursor"> & { source?: string }
) {
  const [hasNewArticles, setHasNewArticles] = useState(false);

  const { data, dataUpdatedAt } = useQuery({
    queryKey: [
      "quick-news-poll",
      {
        category: params.category || "All",
        search: params.search || "",
        source: params.source || "All",
      },
    ],
    queryFn: () =>
      fetchArticles({
        cursor: null,
        limit: 1,
        category: params.category,
        search: params.search,
        source: params.source,
      }),
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    refetchIntervalInBackground: false,
  });

  useEffect(() => {
    if (data && data.articles.length > 0 && currentTopArticleId) {
      const latestFetchedId = data.articles[0].id;
      if (String(latestFetchedId) !== String(currentTopArticleId)) {
        setHasNewArticles(true);
      }
    }
  }, [data, dataUpdatedAt, currentTopArticleId]);

  const dismissNewArticles = () => setHasNewArticles(false);

  return {
    hasNewArticles,
    dismissNewArticles,
  };
}
