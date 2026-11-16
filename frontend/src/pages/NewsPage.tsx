import React from "react";
import { NewsFeed } from "@/components/NewsFeed";
import { Radio, Sparkles } from "lucide-react";

export const NewsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16">
      {/* Quick News Brand Header */}
      <div className="mb-12 border-b border-bone/60 pb-8">
        <div className="flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-widest text-indigo font-bold">
          <Radio className="h-4 w-4 animate-pulse text-indigo" />
          <span>Quick News Wire</span>
          <span className="text-bone">•</span>
          <span className="inline-flex items-center gap-1 text-[11px] text-indigo/80">
            <Sparkles className="h-3 w-3 text-pulse" />
            <span>Gemini Automated Ingestion</span>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-3">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-ink">
            Quick News
          </h1>
          <span className="font-body text-xl italic text-indigo font-semibold">
            Stay informed. Stay ahead.
          </span>
        </div>
        <p className="font-body text-xl text-ink/75 max-w-3xl leading-relaxed">
          Automated news aggregation running on a scheduled 5-minute pipeline across Google News, MIT Tech Review, TechCrunch, The Verge, and arXiv, condensed into exact 60-word executive summaries.
        </p>
      </div>

      {/* News Feed with filters, infinite scroll, debounced search */}
      <NewsFeed />
    </div>
  );
};

export default NewsPage;
