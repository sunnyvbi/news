import { site } from "@/data/content";

export function Contact() {
  return (
    <section id="contact" className="px-6 md:px-12 lg:px-20 py-24">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-indigo mb-3 block">
          Get in Touch
        </span>
        <h2 className="font-display text-clamp-h2 font-bold tracking-tight text-ink mb-6">
          Let&apos;s build interfaces that earn trust
        </h2>
        <p className="font-body text-xl text-ink/80 mb-8 max-w-xl mx-auto">
          Currently taking selective advisory, prototyping, and speaking engagements for embodied AI systems.
        </p>
        <a
          href={`mailto:${site.email}`}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-indigo text-paper font-display text-sm font-semibold tracking-wider uppercase hover:bg-indigoDeep transition-colors"
        >
          <span>{site.email}</span>
        </a>
      </div>
    </section>
  );
}

export default Contact;
