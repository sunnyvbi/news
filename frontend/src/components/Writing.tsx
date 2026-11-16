import { talks, essays } from "@/data/content";
import { Link } from "react-router-dom";

export function Writing() {
  return (
    <section id="writing" className="px-6 md:px-12 lg:px-20 py-24 border-b border-bone/60">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-12 border-b border-bone/60 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo mb-2 block">
              Writing & Talks
            </span>
            <h2 className="font-display text-clamp-h2 font-bold tracking-tight text-ink">
              Essays on Trust, Agents & Embodiment
            </h2>
          </div>
          <Link
            to="/writing"
            className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo hover:text-indigoDeep mt-2 sm:mt-0 transition-colors"
          >
            Explore all monographs →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Essays Column */}
          <div>
            <h3 className="font-display text-xl font-bold text-ink mb-6">
              Selected Essays
            </h3>
            <div className="divide-y divide-bone/60">
              {essays.slice(0, 3).map((item) => (
                <Link
                  key={item.slug}
                  to={`/writing#${item.slug}`}
                  className="py-4 block group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-display text-base font-semibold text-ink group-hover:text-indigo transition-colors block">
                        {item.title}
                      </span>
                      <span className="text-xs font-mono text-ink/60">
                        {item.category} • {item.readTime}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-indigo group-hover:translate-x-1 transition-transform ml-4 shrink-0">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Talks Column */}
          <div>
            <h3 className="font-display text-xl font-bold text-ink mb-6">
              Lectures & Teaching
            </h3>
            <div className="divide-y divide-bone/60">
              {talks.map((talk, idx) => (
                <div key={idx} className="py-4">
                  <div className="flex items-center justify-between text-xs font-mono text-indigo font-bold uppercase mb-0.5">
                    <span>{talk.org}</span>
                    {talk.year && <span className="text-ink/60">{talk.year}</span>}
                  </div>
                  <span className="font-display text-base font-semibold text-ink block">
                    {talk.topic || talk.role}
                  </span>
                  <span className="font-body text-xs text-ink/70">
                    Role: {talk.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/writing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-bone/80 bg-white/70 text-xs font-mono font-semibold uppercase tracking-wider text-ink hover:border-indigo hover:text-indigo transition-all"
          >
            <span>Read full essay monographs on the Writing page</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Writing;
