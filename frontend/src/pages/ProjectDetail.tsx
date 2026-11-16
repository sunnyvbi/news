import { useParams, Link } from "react-router-dom";
import { projects } from "@/data/content";

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-ink mb-4">
          Project Not Found
        </h1>
        <p className="font-body text-base text-ink/70 mb-6">
          The requested project could not be found.
        </p>
        <Link
          to="/"
          className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo hover:underline"
        >
          ← Back to Overview
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-6 md:px-12 py-20">
      <Link
        to="/#work"
        className="inline-flex items-center text-xs font-mono font-semibold uppercase tracking-wider text-indigo hover:underline mb-8"
      >
        ← Back to Selected Work
      </Link>

      <div className="flex items-center gap-3 text-xs font-mono text-ink/60 mb-3">
        <span>{project.category}</span>
        <span>•</span>
        <span>{project.client}</span>
        <span>•</span>
        <span>{project.year}</span>
      </div>

      <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-ink mb-6">
        {project.title}
      </h1>

      <p className="font-body text-xl md:text-2xl text-ink/80 leading-relaxed mb-10 border-b border-bone/60 pb-8">
        {project.summary}
      </p>

      <div className="overflow-hidden rounded-xl bg-bone/30 mb-12">
        <img
          src={project.image}
          alt={project.title}
          className="w-full aspect-[16/9] object-cover"
        />
      </div>

      <div className="space-y-6 max-w-2xl">
        {project.body.map((paragraph, idx) => (
          <p key={idx} className="font-body text-lg leading-relaxed text-ink/85">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}

export default ProjectDetail;
