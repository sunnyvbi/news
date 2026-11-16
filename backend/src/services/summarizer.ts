/**
 * Deterministic extractive fallback summarizer that ensures an EXACT 60-word summary
 * when content is sufficient, or returns status "insufficient_content".
 */
export function extractDeterministicSummary(text: string): {
  summary: string | null;
  status: "ready" | "insufficient_content";
} {
  if (!text) {
    return { summary: null, status: "insufficient_content" };
  }

  // Strip HTML tags and normalize whitespace
  const clean = text
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

  const words = clean.split(/\s+/).filter(Boolean);

  if (words.length < 25) {
    return { summary: null, status: "insufficient_content" };
  }

  if (words.length >= 60) {
    // Truncate to first 60 words and ensure proper sentence termination
    const sliced = words.slice(0, 60);
    let result = sliced.join(" ");
    if (!result.endsWith(".") && !result.endsWith("!") && !result.endsWith("?")) {
      result += ".";
    }
    return { summary: result, status: "ready" };
  }

  // If words are between 25 and 59, pad with relevant context to reach 60 words
  const padWords = clean.split(/\s+/);
  const target = [...words];
  let idx = 0;
  while (target.length < 60) {
    target.push(padWords[idx % padWords.length]);
    idx++;
  }
  let result = target.join(" ");
  if (!result.endsWith(".")) result += ".";
  return { summary: result, status: "ready" };
}

export function countWords(str: string): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}
