import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuickNewsSettings } from "@/hooks/useQuickNewsSettings";
import { useSavedArticles } from "@/hooks/useSavedArticles";
import { CATEGORIES } from "@/types/article";
import { ArrowLeft, Sliders, Sun, Moon, Laptop, Trash2, Check, AlertTriangle } from "lucide-react";

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useQuickNewsSettings();
  const { savedIds, clearSaved } = useSavedArticles();

  const [confirmClear, setConfirmClear] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleClear = () => {
    clearSaved();
    setConfirmClear(false);
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
      {/* Return button */}
      <Link
        to="/news"
        className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-indigo hover:underline mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to News Feed</span>
      </Link>

      {/* Header */}
      <div className="border-b border-bone/60 pb-8 mb-12">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-indigo font-bold mb-1">
          <Sliders className="h-3.5 w-3.5" />
          <span>User Preferences</span>
        </div>
        <h1 className="font-display text-4xl font-extrabold text-ink tracking-tight mb-2">
          Quick News Settings
        </h1>
        <p className="font-body text-lg text-ink/70 max-w-2xl">
          Customize your default reading experience, pagination limits, and cached reading lists.
        </p>
      </div>

      <div className="space-y-10">
        {/* Theme preference */}
        <section className="p-8 rounded-2xl bg-white/70 border border-bone/70 shadow-sm">
          <h2 className="font-display text-xl font-bold text-ink mb-1">
            Appearance
          </h2>
          <p className="font-body text-sm text-ink/70 mb-6">
            Select your preferred display theme for reading.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: "light", label: "Light", icon: Sun, desc: "Paper & ink contrast" },
              { id: "dark", label: "Dark", icon: Moon, desc: "Subtle dark backdrop" },
              { id: "system", label: "System", icon: Laptop, desc: "Match device OS" },
            ].map((theme) => {
              const Icon = theme.icon;
              const isSelected = settings.theme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => updateSettings({ theme: theme.id as any })}
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-indigo bg-indigo/5 shadow-sm"
                      : "border-bone/70 bg-white/50 hover:border-bone"
                  }`}
                >
                  <Icon className={`h-5 w-5 mb-3 ${isSelected ? "text-indigo" : "text-ink/60"}`} />
                  <span className="font-display font-bold text-sm text-ink mb-0.5">
                    {theme.label}
                  </span>
                  <span className="text-xs font-mono text-ink/60">
                    {theme.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Default category */}
        <section className="p-8 rounded-2xl bg-white/70 border border-bone/70 shadow-sm">
          <h2 className="font-display text-xl font-bold text-ink mb-1">
            Default Feed Category
          </h2>
          <p className="font-body text-sm text-ink/70 mb-6">
            Choose which category opens automatically when visiting the news feed.
          </p>

          <div className="max-w-xs">
            <select
              value={settings.defaultCategory}
              onChange={(e) => updateSettings({ defaultCategory: e.target.value })}
              className="w-full rounded-xl border border-bone/80 bg-white px-4 py-2.5 text-xs font-mono text-ink shadow-sm focus:border-indigo focus:outline-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories (Overview)" : cat}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Page size limit */}
        <section className="p-8 rounded-2xl bg-white/70 border border-bone/70 shadow-sm">
          <h2 className="font-display text-xl font-bold text-ink mb-1">
            Articles Per Batch
          </h2>
          <p className="font-body text-sm text-ink/70 mb-6">
            Controls how many articles are loaded per infinite scroll batch.
          </p>

          <div className="max-w-xs">
            <select
              value={settings.pageSize}
              onChange={(e) => updateSettings({ pageSize: parseInt(e.target.value, 10) })}
              className="w-full rounded-xl border border-bone/80 bg-white px-4 py-2.5 text-xs font-mono text-ink shadow-sm focus:border-indigo focus:outline-none cursor-pointer"
            >
              <option value={10}>10 articles</option>
              <option value={20}>20 articles</option>
              <option value={30}>30 articles</option>
            </select>
          </div>
        </section>

        {/* Clear saved articles */}
        <section className="p-8 rounded-2xl bg-white/70 border border-bone/70 shadow-sm">
          <h2 className="font-display text-xl font-bold text-rose-800 mb-1">
            Saved Articles Storage
          </h2>
          <p className="font-body text-sm text-ink/70 mb-6">
            Clear all bookmarks stored locally under <code>quick-news:saved</code>. Currently holding <strong>{savedIds.length}</strong> items.
          </p>

          {clearedNotice && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-mono border border-emerald-200">
              <Check className="h-4 w-4" />
              <span>Saved articles storage successfully cleared!</span>
            </div>
          )}

          {!confirmClear ? (
            <button
              type="button"
              disabled={savedIds.length === 0}
              onClick={() => setConfirmClear(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-rose-300 bg-rose-50/50 text-xs font-mono font-semibold uppercase tracking-wider text-rose-700 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Saved Articles ({savedIds.length})</span>
            </button>
          ) : (
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 max-w-md">
              <div className="flex items-start gap-2.5 mb-4">
                <AlertTriangle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                <p className="text-xs font-mono text-rose-900 leading-relaxed">
                  Are you sure? This will delete all {savedIds.length} bookmarked articles permanently from this browser.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-mono uppercase tracking-wider hover:bg-rose-700"
                >
                  Yes, Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="px-4 py-2 rounded-lg border border-bone/80 bg-white text-ink text-xs font-mono uppercase tracking-wider hover:bg-bone/30"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
