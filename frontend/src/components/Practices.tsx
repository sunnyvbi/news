import { practices, introCopy } from "@/data/content";

export function Practices() {
  return (
    <section id="practices" className="px-6 md:px-12 lg:px-20 py-24 border-b border-bone/60">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo mb-3 block">
            Approach & Practice
          </span>
          <h2 className="font-display text-clamp-h2 font-bold tracking-tight text-ink mb-6">
            {introCopy.heading}
          </h2>
          {introCopy.paragraphs.map((p, idx) => (
            <p key={idx} className="font-body text-lg leading-relaxed text-ink/80 mb-4">
              {p}
            </p>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-bone/60">
          {practices.map((practice) => (
            <div key={practice.id} className="p-6 rounded-lg bg-white/40 border border-bone/50">
              <span className="text-xs font-mono text-indigo uppercase tracking-wider block mb-2">
                {practice.tag}
              </span>
              <h3 className="font-display text-xl font-bold text-ink mb-2">
                {practice.name}
              </h3>
              <p className="font-body text-base text-ink/75 leading-relaxed">
                {practice.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Practices;
