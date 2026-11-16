import React, { useState } from "react";
import { Link } from "react-router-dom";
import { essays, talks } from "@/data/content";
import { ArrowLeft, Clock, Calendar, ChevronDown, ChevronUp, BookOpen, Mic } from "lucide-react";

export const WritingPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "essays" | "talks">("all");
  const [expandedSlug, setExpandedSlug] = useState<string | null>("ambient-consent");

  const toggleExpand = (slug: string) => {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 py-16">
      {/* Back to Home */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-indigo hover:text-indigoDeep transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Studio Overview</span>
        </Link>
      </div>

      {/* Page Header */}
      <header className="mb-14 border-b border-bone/60 pb-10">
        <div className="inline-flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-widest text-indigo font-bold">
          <BookOpen className="h-4 w-4" />
          <span>Essays, Monographs & Field Notes</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-ink mb-4 leading-[1.05]">
          Writing on Interfaces, Trust & Embodiment
        </h1>
        <p className="font-body text-xl md:text-2xl text-ink/80 max-w-3xl leading-relaxed">
          Reflections from the lab bench: how humans negotiate trust with autonomous agents, spatial consent when sensors disappear, and haptic grammars for screenless devices.
        </p>

        {/* View filters */}
        <div className="flex items-center gap-2 mt-8">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
              activeFilter === "all"
                ? "bg-indigo text-paper font-semibold"
                : "bg-white/60 text-ink/75 hover:bg-bone/40 border border-bone/60"
            }`}
          >
            All Work ({essays.length + talks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("essays")}
            className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
              activeFilter === "essays"
                ? "bg-indigo text-paper font-semibold"
                : "bg-white/60 text-ink/75 hover:bg-bone/40 border border-bone/60"
            }`}
          >
            Essays ({essays.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("talks")}
            className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
              activeFilter === "talks"
                ? "bg-indigo text-paper font-semibold"
                : "bg-white/60 text-ink/75 hover:bg-bone/40 border border-bone/60"
            }`}
          >
            Teaching & Talks ({talks.length})
          </button>
        </div>
      </header>

      {/* Essays Section */}
      {(activeFilter === "all" || activeFilter === "essays") && (
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8 border-b border-bone/40 pb-3">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo" />
              <span>Published Essays</span>
            </h2>
            <span className="text-xs font-mono text-ink/60">
              {essays.length} Long-Form Monographs
            </span>
          </div>

          <div className="space-y-8">
            {essays.map((essay) => {
              const isExpanded = expandedSlug === essay.slug;

              return (
                <article
                  key={essay.slug}
                  id={essay.slug}
                  className="rounded-2xl border border-bone/70 bg-white/70 p-8 shadow-sm hover:border-bone transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className="rounded-full bg-bone/40 px-3 py-0.5 text-xs font-mono uppercase tracking-wider text-indigo font-bold">
                      {essay.category}
                    </span>
                    <div className="flex items-center gap-3 text-xs font-mono text-ink/60">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {essay.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {essay.readTime}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display text-2xl md:text-3xl font-bold text-ink mb-2 tracking-tight">
                    {essay.title}
                  </h3>

                  <p className="font-body text-lg italic text-ink/75 mb-5 leading-relaxed">
                    {essay.subtitle}
                  </p>

                  <p className="font-body text-base text-ink/85 leading-relaxed mb-6 bg-paper/60 p-4 rounded-xl border border-bone/50">
                    <strong>Abstract:</strong> {essay.abstract}
                  </p>

                  {/* Expandable Essay Body */}
                  {isExpanded && (
                    <div className="pt-6 border-t border-bone/60 space-y-5 text-ink/90 leading-relaxed font-body text-lg animate-fadeIn">
                      {essay.body.map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))}
                      <div className="mt-8 p-4 rounded-lg bg-indigo/5 border border-indigo/10 text-xs font-mono text-indigo">
                        Published as part of Lior Voss's public research notebook on Embodied Intelligence.
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleExpand(essay.slug)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-indigo hover:text-indigoDeep transition-colors"
                    >
                      <span>{isExpanded ? "Collapse essay" : "Read full essay"}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    <span className="text-xs font-mono text-ink/40">
                      ID: #{essay.slug}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Talks & Teaching Section */}
      {(activeFilter === "all" || activeFilter === "talks") && (
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8 border-b border-bone/40 pb-3">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink flex items-center gap-2">
              <Mic className="h-5 w-5 text-indigo" />
              <span>Teaching, Keynotes & Symposia</span>
            </h2>
            <span className="text-xs font-mono text-ink/60">
              {talks.length} Engagements
            </span>
          </div>

          <div className="divide-y divide-bone/60 rounded-2xl border border-bone/70 bg-white/70 overflow-hidden">
            {talks.map((talk, idx) => (
              <div key={idx} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-bone/20 transition-colors">
                <div>
                  <div className="flex items-center gap-3 text-xs font-mono text-indigo font-bold uppercase mb-1">
                    <span>{talk.org}</span>
                    {talk.year && (
                      <>
                        <span className="text-ink/40">•</span>
                        <span className="text-ink/60">{talk.year}</span>
                      </>
                    )}
                  </div>
                  <h3 className="font-display text-xl font-bold text-ink mb-1">
                    {talk.topic || talk.role}
                  </h3>
                  <p className="font-body text-sm text-ink/70">
                    Role: {talk.role}
                  </p>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-bone/40 text-ink/80 shrink-0 self-start md:self-center">
                  Invited
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Field Notes Dispatch / Newsletter Box */}
      <section className="p-8 md:p-12 rounded-2xl bg-paper border border-bone/80 shadow-sm text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-indigo font-bold block mb-2">
          Dispatch Frequency
        </span>
        <h3 className="font-display text-2xl md:text-3xl font-extrabold text-ink mb-3">
          Field Notes from the Edge of AI
        </h3>
        <p className="font-body text-base text-ink/75 max-w-xl mx-auto mb-6">
          Occasional dispatches covering hardware failures, tactile prototypes, algorithmic consent, and reading lists. Sent 4–6 times a year.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2.5 rounded-full border border-bone/80 bg-white text-xs font-mono text-ink placeholder:text-ink/40 focus:border-indigo focus:outline-none"
          />
          <button
            type="button"
            onClick={() => alert("Thank you for reading along!")}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-indigo text-paper font-display text-xs font-semibold tracking-wider uppercase hover:bg-indigoDeep transition-colors shrink-0"
          >
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
};

export default WritingPage;
