import Hero from "@/components/Hero";
import Practices from "@/components/Practices";
import Marquee from "@/components/Marquee";
import ProjectsGrid from "@/components/ProjectsGrid";
import About from "@/components/About";
import Writing from "@/components/Writing";
import Contact from "@/components/Contact";
import { Link } from "react-router-dom";
import { ArrowRight, Radio } from "lucide-react";

export function Home() {
  return (
    <>
      <Hero />
      <Marquee />

      {/* Quick News Section (Natural addition to existing website) */}
      <section className="px-6 md:px-12 lg:px-20 py-16 bg-white/50 border-b border-bone/60">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-2xl bg-paper border border-bone/80 shadow-sm">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-widest text-indigo font-bold">
              <Radio className="h-4 w-4 animate-pulse text-indigo" />
              <span>Quick News Wire</span>
              <span>•</span>
              <span className="italic font-normal">Stay informed. Stay ahead.</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-ink mb-2">
              Automated Real-Time AI News Intelligence
            </h2>
            <p className="font-body text-base text-ink/75 leading-relaxed">
              Automated 5-minute RSS ingestion processed by Gemini into exact 60-word executive summaries across Robotics, Foundation Models, Research, and Policy.
            </p>
          </div>
          <Link
            to="/news"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-indigo text-paper font-display text-xs font-semibold tracking-wider uppercase hover:bg-indigoDeep transition-all shrink-0 self-start md:self-auto"
          >
            <span>Open Quick News Feed</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Practices />
      <ProjectsGrid />
      <About />
      <Writing />
      <Contact />
    </>
  );
}

export default Home;
