import { heroCopy } from "@/data/content";
import HeroScene from "@/three/HeroScene";
import { Link } from "react-router-dom";
import { ArrowDown, Radio } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden border-b border-bone/60 bg-paper">
      {/* 3D Element Container - aligned to the right side on desktop */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 pointer-events-none flex items-center justify-center lg:justify-end lg:pr-8 xl:pr-20 overflow-hidden opacity-25 lg:opacity-100 z-0"
        aria-hidden="true"
      >
        <HeroScene />
      </div>

      {/* Hero Content - Shifted to the left with reduced left-side margin */}
      <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-14 xl:px-16 py-16 md:py-20 lg:py-24">
        <div className="max-w-xl md:max-w-2xl lg:max-w-3xl text-left">
          {/* Kicker badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/85 border border-bone/70 mb-8 backdrop-blur-xs shadow-xs">
            <span className="h-2 w-2 rounded-full bg-pulse animate-pulse" />
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo">
              {heroCopy.kicker}
            </span>
          </div>

          {/* Headline: Interfaces for a world shared with machines */}
          <h1 className="font-display text-clamp-hero font-extrabold leading-[0.93] tracking-tight text-ink whitespace-pre-line mb-8">
            {heroCopy.heading}
          </h1>

          {/* Subtitle description */}
          <p className="font-body text-xl md:text-2xl lg:text-[1.65rem] leading-relaxed text-ink/85 max-w-2xl mb-10">
            {heroCopy.sub}
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <a
              href="#work"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-paper text-xs font-mono font-semibold uppercase tracking-wider hover:bg-indigo transition-colors shadow-sm"
            >
              <span>Selected Work</span>
              <ArrowDown className="h-3.5 w-3.5" />
            </a>

            <Link
              to="/news"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-bone/80 bg-white/85 hover:border-indigo hover:text-indigo text-xs font-mono font-semibold uppercase tracking-wider text-ink transition-colors backdrop-blur-xs shadow-xs"
            >
              <Radio className="h-3.5 w-3.5 text-indigo animate-pulse" />
              <span>Quick News</span>
            </Link>

            <Link
              to="/writing"
              className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-mono font-semibold uppercase tracking-wider text-ink/75 hover:text-indigo transition-colors"
            >
              <span>Writing & Essays →</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
