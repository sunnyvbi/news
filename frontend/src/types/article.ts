export type Category = 
  | "All"
  | "Top Stories"
  | "World News"
  | "Business"
  | "Stock Market"
  | "Trading"
  | "Cryptocurrency"
  | "Technology"
  | "AI & Innovation"
  | "Science"
  | "Startups"
  | "Research"
  | "Robotics"
  | "Policy"
  | "AI"
  | "Machine Learning";

export const CATEGORIES: Category[] = [
  "All",
  "Top Stories",
  "World News",
  "Business",
  "Stock Market",
  "Trading",
  "Cryptocurrency",
  "Technology",
  "AI & Innovation",
  "Science",
  "Startups",
  "Research",
  "Robotics",
  "Policy",
];

export interface Article {
  id: string | number;
  title: string;
  publisher: string;
  originalUrl: string;
  publishedAt: string | null;
  category: string;
  summary: string;
  imageUrl?: string;
  canonicalUrl?: string;
  keywords?: string[];
  mainTopic?: string;
  summaryStatus?: "ready" | "insufficient_content" | "failed";
}

export interface ArticlesResponse {
  articles: Article[];
  nextCursor: string | null;
  hasMore?: boolean;
  totalCount?: number;
}

export interface ArticlesQueryParams {
  cursor?: string | null;
  limit?: number;
  category?: string;
  search?: string;
  source?: string;
}
