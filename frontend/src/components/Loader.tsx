import { useEffect, useState } from "react";

export function Loader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(true);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-paper transition-opacity duration-500 pointer-events-none"
      style={{ opacity: hidden ? 0 : 1 }}
    >
      <div className="flex items-center gap-2 font-display text-sm font-semibold tracking-wider text-ink uppercase">
        <span className="inline-block h-2 w-2 rounded-full bg-pulse animate-pulse" />
        <span>Loading</span>
      </div>
    </div>
  );
}

export default Loader;
