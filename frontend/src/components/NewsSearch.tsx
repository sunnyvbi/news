import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface NewsSearchProps {
  initialValue?: string;
  onSearchChange: (query: string) => void;
}

export const NewsSearch: React.FC<NewsSearchProps> = ({
  initialValue = "",
  onSearchChange,
}) => {
  const [value, setValue] = useState(initialValue);
  const debounced = useDebounce(value, 400);

  // Keep latest onSearchChange in a ref to avoid re-triggering effects on parent renders
  const onSearchChangeRef = useRef(onSearchChange);
  onSearchChangeRef.current = onSearchChange;

  // Track the last emitted search string
  const lastEmittedRef = useRef(initialValue);

  // Sync internal input value if external initialValue changes (e.g. user clears URL param)
  useEffect(() => {
    setValue(initialValue);
    lastEmittedRef.current = initialValue;
  }, [initialValue]);

  // Only emit when debounced value has genuinely changed from what was last emitted
  useEffect(() => {
    if (debounced !== lastEmittedRef.current) {
      lastEmittedRef.current = debounced;
      onSearchChangeRef.current(debounced);
    }
  }, [debounced]);

  const handleClear = () => {
    setValue("");
    if (lastEmittedRef.current !== "") {
      lastEmittedRef.current = "";
      onSearchChangeRef.current("");
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/50" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search headline, publisher, or keywords..."
        className="w-full rounded-full border border-bone/80 bg-white/70 py-2 pl-10 pr-9 text-xs font-mono text-ink placeholder:text-ink/40 focus:border-indigo focus:bg-white focus:outline-none transition-all shadow-sm"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export default NewsSearch;
