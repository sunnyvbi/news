export function Marquee() {
  const items = [
    "SPATIAL INTERACTION",
    "EMBODIED INTELLIGENCE",
    "AGENTIC WORKFLOWS",
    "MULTIMODAL SENSING",
    "HUMAN-AGENT TRUST",
    "HARDWARE PROTOTYPING",
  ];

  return (
    <div className="py-6 border-b border-bone/60 bg-white/30 overflow-hidden whitespace-nowrap">
      <div className="marquee-track flex gap-8 items-center text-xs font-mono font-bold tracking-widest text-indigo/70 uppercase">
        {items.concat(items).map((item, idx) => (
          <span key={idx} className="flex items-center gap-8">
            <span>{item}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-pulse" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
