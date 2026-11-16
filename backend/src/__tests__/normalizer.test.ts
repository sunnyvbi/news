import { describe, it, expect } from "vitest";
import { normalizeCanonicalUrl, normalizeTitle } from "../ingestion/normalizer.js";

describe("Normalizer Utilities", () => {
  it("cleans UTM tags, tracking parameters and trailing slashes from URLs", () => {
    const dirtyUrl = "https://techcrunch.com/2026/11/ai-agents/?utm_source=twitter&utm_medium=social&ref=feed#section";
    const cleaned = normalizeCanonicalUrl(dirtyUrl);
    expect(cleaned).toBe("https://techcrunch.com/2026/11/ai-agents");
  });

  it("normalizes titles by stripping publisher suffixes and punctuation for deduplication", () => {
    const rawTitle1 = "SpaceX Catches Massive Starship Booster - The Verge";
    const rawTitle2 = "SpaceX Catches Massive Starship Booster | TechCrunch";

    expect(normalizeTitle(rawTitle1)).toBe("spacex catches massive starship booster");
    expect(normalizeTitle(rawTitle2)).toBe("spacex catches massive starship booster");
  });
});
