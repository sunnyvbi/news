import { Link, useLocation } from "react-router-dom";
import { site } from "@/data/content";
import { useSavedArticles } from "@/hooks/useSavedArticles";
import { Bookmark, Settings, Radio } from "lucide-react";

export function Header() {
  const location = useLocation();
  const { savedIds } = useSavedArticles();
  const isNewsActive =
    location.pathname.startsWith("/news") ||
    location.pathname.startsWith("/article") ||
    location.pathname.startsWith("/category") ||
    location.pathname.startsWith("/search");
  const isWritingActive = location.pathname.startsWith("/writing");
  const isSavedActive = location.pathname.startsWith("/saved");
  const isSettingsActive = location.pathname.startsWith("/settings");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-bone/60 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-12">
        <Link
          to="/"
          className="font-display text-lg font-bold tracking-widest text-ink hover:text-indigo transition-colors"
        >
          {site.wordmark}
        </Link>

        <nav className="flex items-center gap-5 md:gap-7 text-xs font-mono font-medium uppercase tracking-wider text-ink/80">
          <a href="/#work" className="hover:text-indigo transition-colors hidden sm:inline">
            Work
          </a>
          <a href="/#practices" className="hover:text-indigo transition-colors hidden md:inline">
            Practices
          </a>
          <a href="/#about" className="hover:text-indigo transition-colors hidden lg:inline">
            About
          </a>

          {/* Dedicated Writing Page */}
          <Link
            to="/writing"
            className={`transition-colors hidden md:inline ${
              isWritingActive
                ? "text-indigo font-bold underline underline-offset-4"
                : "hover:text-indigo"
            }`}
          >
            Writing
          </Link>

          {/* Quick News Primary Navigation Pill */}
          <Link
            to="/news"
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
              isNewsActive
                ? "bg-indigo text-paper font-semibold shadow-sm"
                : "border border-bone hover:border-indigo hover:text-indigo bg-white/50"
            }`}
          >
            <Radio className="h-3.5 w-3.5 text-pulse animate-pulse" />
            <span>Quick News</span>
          </Link>

          {/* Saved Articles Link */}
          <Link
            to="/saved"
            className={`inline-flex items-center gap-1 transition-colors ${
              isSavedActive
                ? "text-indigo font-bold"
                : "text-ink/75 hover:text-indigo"
            }`}
            title="Saved Articles"
          >
            <Bookmark className={`h-4 w-4 ${savedIds.length > 0 ? "fill-indigo text-indigo" : ""}`} />
            {savedIds.length > 0 && (
              <span className="text-[11px] font-bold text-indigo">
                {savedIds.length}
              </span>
            )}
          </Link>

          {/* Quick News Settings Link */}
          <Link
            to="/settings"
            className={`transition-colors p-1 rounded-md ${
              isSettingsActive ? "text-indigo" : "text-ink/60 hover:text-ink"
            }`}
            title="Quick News Settings"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </Link>

          <a
            href="/#contact"
            className="hover:text-indigo transition-colors hidden sm:inline"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
