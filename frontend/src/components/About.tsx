import { aboutCopy } from "@/data/content";

export function About() {
  return (
    <section id="about" className="px-6 md:px-12 lg:px-20 py-24 border-b border-bone/60">
      <div className="max-w-4xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-indigo mb-3 block">
          Background
        </span>
        <h2 className="font-display text-clamp-h2 font-bold tracking-tight text-ink mb-8">
          {aboutCopy.heading}
        </h2>
        {aboutCopy.paragraphs.map((p, idx) => (
          <p key={idx} className="font-body text-xl leading-relaxed text-ink/80 mb-6">
            {p}
          </p>
        ))}
        <div className="mt-8 p-6 rounded-lg bg-white/50 border border-bone/60">
          <span className="text-xs font-mono text-indigo uppercase tracking-wider block mb-1">
            Now
          </span>
          <p className="font-body text-base text-ink/85 italic">
            {aboutCopy.current}
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
