import Parser from "rss-parser";
import { prisma } from "../db.js";
import { logger } from "../logger.js";
import { RSS_FEEDS, FeedConfig } from "./feeds.js";
import { normalizeCanonicalUrl, normalizeTitle, extractImageUrl } from "./normalizer.js";
import { processArticleWithGemini } from "../services/gemini.js";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "QuickNews-Bot/1.0 (+https://quicknews.local)",
    Accept: "application/rss+xml, application/xml, text/xml",
  },
});

let isRunning = false;

export async function runIngestion(): Promise<{
  articlesFound: number;
  articlesCreated: number;
  articlesSkipped: number;
}> {
  if (isRunning) {
    logger.warn("Ingestion already running; skipping overlapping cycle");
    return { articlesFound: 0, articlesCreated: 0, articlesSkipped: 0 };
  }

  isRunning = true;
  const startedAt = new Date();
  logger.info("Starting automated Quick News ingestion cycle...");

  let totalFound = 0;
  let totalCreated = 0;
  let totalSkipped = 0;

  try {
    for (const feedConfig of RSS_FEEDS) {
      const result = await processSingleFeed(feedConfig);
      totalFound += result.found;
      totalCreated += result.created;
      totalSkipped += result.skipped;
    }

    await prisma.ingestionLog.create({
      data: {
        source: "all_feeds",
        status: "success",
        articlesFound: totalFound,
        articlesCreated: totalCreated,
        articlesSkipped: totalSkipped,
        startedAt,
        completedAt: new Date(),
      },
    });

    logger.info(
      { totalFound, totalCreated, totalSkipped },
      "Ingestion cycle completed successfully"
    );
  } catch (error: any) {
    logger.error({ error }, "Error during ingestion cycle");
    await prisma.ingestionLog.create({
      data: {
        source: "all_feeds",
        status: "failed",
        articlesFound: totalFound,
        articlesCreated: totalCreated,
        articlesSkipped: totalSkipped,
        errorMessage: error?.message || String(error),
        startedAt,
        completedAt: new Date(),
      },
    });
  } finally {
    isRunning = false;
  }

  return {
    articlesFound: totalFound,
    articlesCreated: totalCreated,
    articlesSkipped: totalSkipped,
  };
}

async function processSingleFeed(feedConfig: FeedConfig): Promise<{
  found: number;
  created: number;
  skipped: number;
}> {
  let found = 0;
  let created = 0;
  let skipped = 0;

  try {
    logger.info({ feed: feedConfig.name }, "Fetching RSS feed");
    const feed = await parser.parseURL(feedConfig.url);
    const items = feed.items || [];
    found = items.length;

    // Ensure Publisher exists in DB
    const publisher = await prisma.publisher.upsert({
      where: { name: feedConfig.name },
      update: { website: feedConfig.website, rssUrl: feedConfig.url },
      create: {
        name: feedConfig.name,
        website: feedConfig.website,
        rssUrl: feedConfig.url,
      },
    });

    for (const item of items.slice(0, 10)) {
      const title = item.title?.trim();
      const rawUrl = item.link?.trim();

      if (!title || !rawUrl) {
        skipped++;
        continue;
      }

      const canonicalUrl = normalizeCanonicalUrl(rawUrl);
      const normalizedTitle = normalizeTitle(title);

      // Check for duplicate in DB by canonicalUrl or (normalizedTitle + publisherId)
      const existing = await prisma.article.findFirst({
        where: {
          OR: [
            { canonicalUrl },
            {
              AND: [
                { normalizedTitle },
                { publisherId: publisher.id },
              ],
            },
          ],
        },
      });

      if (existing) {
        skipped++;
        continue;
      }

      // New article! Extract text and send to Gemini
      const rawContent =
        item["content:encoded"] ||
        item.content ||
        item.contentSnippet ||
        item.summary ||
        title;

      const imageUrl = extractImageUrl(item);
      const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();

      const geminiResult = await processArticleWithGemini(
        title,
        rawContent,
        feedConfig.defaultCategory
      );

      // Ensure Category exists
      const categorySlug = geminiResult.category.toLowerCase().replace(/\s+/g, "-");
      const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: {
          name: geminiResult.category,
          slug: categorySlug,
        },
      });

      // Insert article
      await prisma.article.create({
        data: {
          title,
          normalizedTitle,
          originalUrl: rawUrl,
          canonicalUrl,
          publisherId: publisher.id,
          categoryId: category.id,
          content: rawContent,
          summary: geminiResult.summary,
          summaryStatus: geminiResult.summaryStatus,
          geminiStatus: geminiResult.geminiStatus,
          keywords: geminiResult.keywords,
          mainTopic: geminiResult.mainTopic,
          imageUrl: imageUrl || null,
          publishedAt,
        },
      });

      created++;
    }
  } catch (error: any) {
    logger.warn({ feed: feedConfig.name, error: error?.message }, "Failed to process feed");
  }

  return { found, created, skipped };
}
