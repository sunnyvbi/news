import { Article, ArticlesQueryParams, ArticlesResponse } from "@/types/article";
import { MOCK_ARTICLES } from "@/data/mockArticles";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

/**
 * Fetch articles with cursor-based pagination, category, source, and search.
 */
export async function fetchArticles(params: ArticlesQueryParams & { source?: string }): Promise<ArticlesResponse> {
  const { cursor, limit = 10, category, search, source } = params;

  const urlParams = new URLSearchParams();
  if (cursor) urlParams.set("cursor", cursor);
  if (limit) urlParams.set("limit", limit.toString());
  if (category && category !== "All") urlParams.set("category", category);
  if (search && search.trim()) urlParams.set("search", search.trim());
  if (source && source !== "All") urlParams.set("source", source);

  try {
    const res = await fetch(`/api/articles?${urlParams.toString()}`);
    if (res.ok) {
      const data = await res.json();
      return {
        articles: data.articles || [],
        nextCursor: data.nextCursor ?? null,
        hasMore: data.hasMore ?? Boolean(data.nextCursor),
        totalCount: data.totalCount ?? data.articles?.length,
      };
    }
  } catch {
    // If backend is not running or offline, fall back to mock data
  }

  // Fallback mock filtering and cursor pagination
  let filtered = [...MOCK_ARTICLES];

  if (category && category !== "All") {
    filtered = filtered.filter(
      (a) => a.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (source && source !== "All") {
    filtered = filtered.filter(
      (a) => a.publisher.toLowerCase() === source.toLowerCase()
    );
  }

  if (search && search.trim()) {
    const query = search.trim().toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.summary.toLowerCase().includes(query) ||
        a.publisher.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query)
    );
  }

  const startIndex = cursor ? parseInt(cursor, 10) : 0;
  const safeStartIndex = isNaN(startIndex) ? 0 : startIndex;
  const pagedArticles = filtered.slice(safeStartIndex, safeStartIndex + limit);
  const nextIndex = safeStartIndex + limit;
  const nextCursor = nextIndex < filtered.length ? nextIndex.toString() : null;

  return {
    articles: pagedArticles,
    nextCursor,
    hasMore: Boolean(nextCursor),
    totalCount: filtered.length,
  };
}

/**
 * Fetch a single article by ID.
 */
export async function fetchArticleById(id: string | number): Promise<Article> {
  try {
    const res = await fetch(`/api/articles/${id}`);
    if (res.status === 404) {
      throw new ApiError("Article not found", 404);
    }
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    if (err instanceof ApiError) throw err;
  }

  const found = MOCK_ARTICLES.find((a) => String(a.id) === String(id));
  if (!found) {
    throw new ApiError("Article not found", 404);
  }
  return found;
}

/**
 * Fetch related articles by category.
 */
export async function fetchRelatedArticles(
  category: string,
  excludeId: string | number,
  limit: number = 3
): Promise<Article[]> {
  try {
    const res = await fetch(`/api/articles?category=${encodeURIComponent(category)}&limit=${limit + 1}`);
    if (res.ok) {
      const data = await res.json();
      const articles: Article[] = data.articles || [];
      return articles.filter((a) => String(a.id) !== String(excludeId)).slice(0, limit);
    }
  } catch {
    // Fall back to mock
  }

  return MOCK_ARTICLES.filter(
    (a) => a.category.toLowerCase() === category.toLowerCase() && String(a.id) !== String(excludeId)
  ).slice(0, limit);
}
