import { Link } from "react-router-dom";
import { projects } from "@/data/content";

export function ProjectsGrid() {
  return (
    <section id="work" className="px-6 md:px-12 lg:px-20 py-24 border-b border-bone/60">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-16 border-b border-bone/60 pb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo block mb-2">
              Selected Work
            </span>
            <h2 className="font-display text-clamp-h2 font-bold tracking-tight text-ink">
              Recent Prototypes & Systems
            </h2>
          </div>
          <span className="text-xs font-mono text-ink/60 mt-2 sm:mt-0">
            {projects.length} Case Studies
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((proj) => (
            <article key={proj.slug} className="group flex flex-col justify-between">
              <Link to={`/work/${proj.slug}`} className="block overflow-hidden rounded-lg mb-6 bg-bone/30">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div>
                <div className="flex items-center gap-3 text-xs font-mono text-ink/60 mb-2">
                  <span>{proj.category}</span>
                  <span>•</span>
                  <span>{proj.year}</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-ink group-hover:text-indigo transition-colors mb-3">
                  <Link to={`/work/${proj.slug}`}>
                    {proj.title}
                  </Link>
                </h3>
                <p className="font-body text-base text-ink/80 leading-relaxed mb-4">
                  {proj.summary}
                </p>
                <Link
                  to={`/work/${proj.slug}`}
                  className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-indigo hover:text-indigoDeep transition-colors"
                >
                  Read Case Study →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectsGrid;
