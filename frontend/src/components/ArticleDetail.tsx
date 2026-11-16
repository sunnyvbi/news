import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useArticle, useRelatedArticles } from "@/hooks/useArticles";
import BookmarkButton from "./BookmarkButton";
import NewsCard from "./NewsCard";
import { formatRelativeTime } from "@/lib/formatters";
import { ArrowLeft, ArrowUpRight, Clock, AlertCircle } from "lucide-react";

export const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const { data: article, isLoading, isError } = useArticle(id);

  const { data: relatedArticles, isLoading: isLoadingRelated } = useRelatedArticles(
    article?.category,
    article?.id,
    3
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 animate-pulse">
        <div className="h-4 w-32 bg-bone/50 rounded mb-8" />
        <div className="h-6 w-24 bg-bone/40 rounded-full mb-4" />
        <div className="h-10 w-full bg-bone/50 rounded mb-4" />
        <div className="h-10 w-3/4 bg-bone/50 rounded mb-6" />
        <div className="aspect-[16/9] w-full bg-bone/40 rounded-xl mb-8" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-bone/40 rounded" />
          <div className="h-4 w-full bg-bone/40 rounded" />
          <div className="h-4 w-2/3 bg-bone/40 rounded" />
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center">
        <AlertCircle className="h-10 w-10 text-rose-500 mb-3" />
        <h1 className="font-display text-2xl font-bold text-ink mb-2">
          Article Not Found
        </h1>
        <p className="font-body text-base text-ink/70 mb-6 max-w-sm">
          The requested news article could not be retrieved or has expired.
        </p>
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-indigo hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to News Feed</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-6 md:px-12 py-16">
      {/* Return link & Bookmark button */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-bone/60">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-indigo hover:text-indigoDeep transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to News Feed</span>
        </Link>
        <BookmarkButton articleId={article.id} showText={true} />
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-ink/60 mb-4">
        <Link
          to={`/category/${encodeURIComponent(article.category)}`}
          className="rounded-full bg-bone/40 px-3 py-1 font-bold text-indigo uppercase hover:opacity-80 transition-opacity"
        >
          {article.category}
        </Link>
        <span>•</span>
        <span className="font-bold text-ink">{article.publisher}</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3 inline" />
          {formatRelativeTime(article.publishedAt || "")}
        </span>
      </div>

      {/* Headline */}
      <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink mb-8 leading-tight">
        {article.title}
      </h1>

      {/* Image if available */}
      {article.imageUrl && (
        <div className="overflow-hidden rounded-xl bg-bone/30 mb-10 shadow-sm border border-bone/60">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full aspect-[16/9] object-cover"
          />
        </div>
      )}

      {/* 60-Word Executive Summary */}
      <div className="p-8 rounded-2xl bg-white/80 border border-bone/70 shadow-sm mb-12">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo block">
            Executive Summary (Verified 60 Words)
          </span>
          {article.summaryStatus === "insufficient_content" && (
            <span className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Source text brief
            </span>
          )}
        </div>
        <p className="font-body text-xl md:text-2xl leading-relaxed text-ink/90">
          {article.summary}
        </p>

        {/* Verified Keywords & Financial Tickers */}
        {article.keywords && article.keywords.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-bone/40">
            <span className="text-[11px] font-mono uppercase tracking-wider text-ink/50 mr-1">
              Verified Topics:
            </span>
            {article.keywords.map((kw, i) => (
              <span
                key={i}
                className={`inline-block rounded-full px-3 py-1 text-xs font-mono ${
                  kw.startsWith("$")
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold"
                    : "bg-bone/40 text-ink/80"
                }`}
              >
                {kw}
              </span>
            ))}
          </div>
        )}

        {/* Read Full Article Button */}
        <div className="mt-8 pt-6 border-t border-bone/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span className="text-xs font-mono text-ink/60">
            Original reporting hosted on <strong>{article.publisher}</strong>
          </span>
          <a
            href={article.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-indigo text-paper font-display text-xs font-semibold tracking-wider uppercase hover:bg-indigoDeep transition-colors"
          >
            <span>Read Original Article</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Related Articles Rail */}
      <section className="mt-16 pt-10 border-t border-bone/60">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-indigo font-bold block mb-1">
              Related Reporting
            </span>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              More from {article.category}
            </h2>
          </div>
          <Link
            to={`/category/${encodeURIComponent(article.category)}`}
            className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo hover:underline"
          >
            View all →
          </Link>
        </div>

        {isLoadingRelated ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-48 bg-bone/30 rounded-xl animate-pulse" />
            <div className="h-48 bg-bone/30 rounded-xl animate-pulse" />
            <div className="h-48 bg-bone/30 rounded-xl animate-pulse" />
          </div>
        ) : relatedArticles && relatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <NewsCard key={rel.id} article={rel} />
            ))}
          </div>
        ) : (
          <p className="text-xs font-mono text-ink/60">
            No additional articles found in this category right now.
          </p>
        )}
      </section>
    </article>
  );
};

export default ArticleDetail;
