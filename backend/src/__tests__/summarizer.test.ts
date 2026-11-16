import { describe, it, expect } from "vitest";
import { extractDeterministicSummary, countWords } from "../services/summarizer.js";

describe("Summarizer Service", () => {
  it("counts words accurately", () => {
    expect(countWords("The quick brown fox jumps over the lazy dog.")).toBe(9);
    expect(countWords("   Multiple    spaces   between   words.  ")).toBe(4);
    expect(countWords("")).toBe(0);
  });

  it("marks articles with less than 25 words as insufficient_content", () => {
    const shortText = "OpenAI announced a new beta release today with small enhancements.";
    const result = extractDeterministicSummary(shortText);
    expect(result.status).toBe("insufficient_content");
    expect(result.summary).toBeNull();
  });

  it("produces an EXACT 60-word summary when content is long enough", () => {
    const longArticle = `
      Deep learning research in physical robotics is accelerating rapidly worldwide.
      Engineers across multiple national institutions published a detailed benchmark
      showing that multi-sensory foundation models outperform traditional control architectures
      in unstructured industrial assembly environments. The systems process visual and tactile
      signals synchronously, reducing calibration errors by over forty percent. Factory managers
      noted that the models adaptively handled flexible cables, reflective surfaces, and minor
      part misalignments without requiring human intervention or custom mechanical fixturing.
      This milestone marks a decisive shift from single-purpose industrial robot arms toward
      general-purpose robotic labor capable of performing complex physical tasks reliably
      and safely alongside human co-workers on modern factory floors.
    `;

    const result = extractDeterministicSummary(longArticle);
    expect(result.status).toBe("ready");
    expect(result.summary).not.toBeNull();

    const actualWordCount = countWords(result.summary!);
    expect(actualWordCount).toBe(60);
  });
});
