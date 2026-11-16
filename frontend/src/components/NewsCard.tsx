import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Article } from "@/types/article";
import BookmarkButton from "./BookmarkButton";
import { formatRelativeTime } from "@/lib/formatters";
import { ArrowUpRight, Clock } from "lucide-react";

interface NewsCardProps {
  article: Article;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    navigate(`/article/${article.id}`);
  };

  return (
    <article
      onClick={handleCardClick}
      className="group flex flex-col justify-between rounded-xl border border-bone/60 bg-white/70 p-6 shadow-sm transition-all duration-300 hover:border-indigo/40 hover:shadow-md cursor-pointer"
    >
      <div>
        {/* Thumbnail Image */}
        {article.imageUrl && (
          <div
            onClick={() => navigate(`/article/${article.id}`)}
            className="mb-5 aspect-[16/9] w-full overflow-hidden rounded-lg bg-bone/30 cursor-pointer"
          >
            <img
              src={article.imageUrl}
              alt={article.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Category & Bookmark Toggle */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-block rounded-full bg-bone/40 px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider text-indigo font-bold">
            {article.category}
          </span>
          <BookmarkButton articleId={article.id} />
        </div>

        {/* Publisher & Published Date */}
        <div className="flex items-center gap-2 text-xs font-mono text-ink/60 mb-2.5">
          <span className="font-semibold text-ink">{article.publisher}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 inline" />
            {formatRelativeTime(article.publishedAt || "")}
          </span>
        </div>

        {/* Headline */}
        <h3 className="font-display text-xl font-bold leading-snug tracking-tight text-ink group-hover:text-indigo transition-colors mb-3">
          <Link
            to={`/article/${article.id}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:underline focus-visible:outline-none"
          >
            {article.title}
          </Link>
        </h3>

        {/* 60-Word Summary */}
        <p className="font-body text-base leading-relaxed text-ink/80 line-clamp-3">
          {article.summary}
        </p>

        {/* Verified Keywords / Financial Tickers */}
        {article.keywords && article.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {article.keywords.slice(0, 4).map((kw, i) => (
              <span
                key={i}
                className={`inline-block rounded px-2 py-0.5 text-[10px] font-mono ${
                  kw.startsWith("$")
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold"
                    : "bg-bone/40 text-ink/70"
                }`}
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Explicit "Read full article" link */}
      <div className="mt-6 pt-4 border-t border-bone/50 flex items-center justify-between">
        <Link
          to={`/article/${article.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo hover:text-indigoDeep transition-colors"
        >
          View details →
        </Link>

        <a
          href={article.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-ink/80 hover:text-indigo transition-colors"
        >
          <span>Read full article</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
};

export default NewsCard;
