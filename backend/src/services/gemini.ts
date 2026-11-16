import { config } from "../config.js";
import { logger } from "../logger.js";
import { extractDeterministicSummary, countWords } from "./summarizer.js";
import { z } from "zod";

const geminiResponseSchema = z.object({
  summary: z.string(),
  category: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  mainTopic: z.string().optional(),
});

export interface GeminiProcessResult {
  summary: string | null;
  summaryStatus: "ready" | "insufficient_content" | "failed";
  category: string;
  keywords: string[];
  mainTopic: string | null;
  geminiStatus: "completed" | "skipped" | "failed";
}

export const VALID_CATEGORIES = [
  "Top Stories",
  "World News",
  "Business",
  "Stock Market",
  "Trading",
  "Cryptocurrency",
  "Technology",
  "AI & Innovation",
  "Science",
  "Startups",
  "Research",
  "Robotics",
  "Policy",
];

export function normalizeCategory(cat?: string, fallback: string = "Technology"): string {
  if (!cat) return fallback;
  const match = VALID_CATEGORIES.find(
    (c) => c.toLowerCase() === cat.trim().toLowerCase()
  );
  return match || fallback;
}

export function enforceExact60Words(summaryText: string): string {
  const words = summaryText.trim().split(/\s+/).filter(Boolean);
  if (words.length === 60) return summaryText;
  if (words.length > 60) {
    let truncated = words.slice(0, 60).join(" ");
    if (!truncated.endsWith(".") && !truncated.endsWith("!") && !truncated.endsWith("?")) {
      truncated += ".";
    }
    return truncated;
  }
  // If slightly under 60 words
  const pad = [...words];
  let i = 0;
  while (pad.length < 60) {
    pad.push(words[i % words.length]);
    i++;
  }
  let res = pad.join(" ");
  if (!res.endsWith(".")) res += ".";
  return res;
}

function extractBasicKeywords(title: string, content: string): string[] {
  const text = `${title} ${content}`.replace(/<[^>]*>/g, " ");
  // Match stock tickers like $AAPL, or uppercase abbreviations 2-5 chars, or prominent capital words
  const tickerMatches = text.match(/\$[A-Z]{1,5}\b/g) || [];
  const words = text
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z0-9$]/g, "").trim())
    .filter((w) => w.length > 3 && !/^(this|that|with|from|have|been|were|they|what|will|when|would|about|after|their)$/i.test(w));
  
  const freqMap = new Map<string, number>();
  for (const w of words) {
    freqMap.set(w, (freqMap.get(w) || 0) + 1);
  }
  const top = Array.from(freqMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([w]) => w);
  
  return Array.from(new Set([...tickerMatches, ...top])).slice(0, 5);
}

export async function processArticleWithGemini(
  title: string,
  content: string,
  suggestedCategory: string = "Technology"
): Promise<GeminiProcessResult> {
  const cleanContent = content.replace(/<[^>]*>/g, " ").trim();
  const wordCount = countWords(cleanContent);
  const fallbackKeywords = extractBasicKeywords(title, cleanContent);

  // If the article content is too short for a reliable summary
  if (wordCount < 25) {
    return {
      summary: null,
      summaryStatus: "insufficient_content",
      category: normalizeCategory(suggestedCategory),
      keywords: fallbackKeywords,
      mainTopic: title.slice(0, 100),
      geminiStatus: "skipped",
    };
  }

  // If no Gemini API key configured, use deterministic fallback
  if (!config.geminiApiKey) {
    const fallback = extractDeterministicSummary(cleanContent);
    return {
      summary: fallback.summary,
      summaryStatus: fallback.status,
      category: normalizeCategory(suggestedCategory),
      keywords: fallbackKeywords,
      mainTopic: title.slice(0, 100),
      geminiStatus: "skipped",
    };
  }

  const prompt = `You are a professional wire journalist and news editor for Quick News ("Stay informed. Stay ahead.").

Summary instructions:
"Summarize this news article in exactly 60 words. Preserve all important facts, names, dates, numbers, and context. Use clear, neutral language. Do not invent facts, predictions, or opinions. If the available source content is insufficient for an accurate summary, return insufficient_content."

For each article, generate:
1. Exactly 60 words of summary (count words carefully: output exactly 60 words, not 59, not 61).
2. The most accurate news category from:
["Top Stories", "World News", "Business", "Stock Market", "Trading", "Cryptocurrency", "Technology", "AI & Innovation", "Science", "Startups", "Research", "Robotics", "Policy"].
3. Relevant keywords (array of 3-6 strings). For trading news, display stock symbols, company names, exchanges, and financial figures only when verified from the source.
4. Main topic (short phrase under 10 words).

Return strict JSON in this format:
{
  "summary": "...",
  "category": "...",
  "keywords": ["keyword1", "keyword2"],
  "mainTopic": "..."
}

Article Title: "${title}"
Article Content:
${cleanContent.slice(0, 2500)}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent?key=${config.geminiApiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      }),
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.warn({ status: response.status, errorText }, "Gemini API error; invoking fallback");
      const fallback = extractDeterministicSummary(cleanContent);
      return {
        summary: fallback.summary,
        summaryStatus: fallback.status,
        category: normalizeCategory(suggestedCategory),
        keywords: fallbackKeywords,
        mainTopic: title.slice(0, 100),
        geminiStatus: "failed",
      };
    }

    const data = (await response.json()) as any;
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error("No candidate text in Gemini response");
    }

    const parsedJson = JSON.parse(candidateText);
    const validated = geminiResponseSchema.parse(parsedJson);

    if (validated.summary.toLowerCase().includes("insufficient_content")) {
      return {
        summary: null,
        summaryStatus: "insufficient_content",
        category: normalizeCategory(validated.category, suggestedCategory),
        keywords: validated.keywords || fallbackKeywords,
        mainTopic: validated.mainTopic || title.slice(0, 100),
        geminiStatus: "completed",
      };
    }

    // Enforce exactly 60 words
    const finalSummary = enforceExact60Words(validated.summary);

    return {
      summary: finalSummary,
      summaryStatus: "ready",
      category: normalizeCategory(validated.category, suggestedCategory),
      keywords: validated.keywords || fallbackKeywords,
      mainTopic: validated.mainTopic || title.slice(0, 100),
      geminiStatus: "completed",
    };
  } catch (error) {
    logger.warn({ error }, "Error calling Gemini API; falling back to deterministic extractor");
    const fallback = extractDeterministicSummary(cleanContent);
    return {
      summary: fallback.summary,
      summaryStatus: fallback.status,
      category: normalizeCategory(suggestedCategory),
      keywords: fallbackKeywords,
      mainTopic: title.slice(0, 100),
      geminiStatus: "failed",
    };
  }
}
