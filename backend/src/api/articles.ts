import { Router, Request, Response } from "express";
import { prisma } from "../db.js";
import { z } from "zod";

const router = Router();

const querySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(10),
  category: z.string().optional(),
  search: z.string().optional(),
  source: z.string().optional(),
});

// GET /api/articles
router.get("/", async (req: Request, res: Response) => {
  try {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid query parameters", details: parsed.error.format() });
      return;
    }

    const { cursor, limit, category, search, source } = parsed.data;

    const where: any = {};

    // Category filter
    if (category && category !== "All") {
      where.category = {
        name: { equals: category, mode: "insensitive" },
      };
    }

    // Publisher / source filter
    if (source && source !== "All") {
      where.publisher = {
        name: { equals: source, mode: "insensitive" },
      };
    }

    // Search query across title and summary
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
      ];
    }

    // Cursor pagination (using id cursor with take limit + 1)
    const articles = await prisma.article.findMany({
      where,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: [
        { publishedAt: "desc" },
        { id: "desc" },
      ],
      include: {
        publisher: true,
        category: true,
      },
    });

    const hasMore = articles.length > limit;
    const pagedArticles = hasMore ? articles.slice(0, limit) : articles;
    const nextCursor = hasMore ? pagedArticles[pagedArticles.length - 1].id : null;

    // Total count for filters
    const totalCount = await prisma.article.count({ where });

    // Format response to match frontend interface
    const formatted = pagedArticles.map((a: any) => ({
      id: a.id,
      title: a.title,
      publisher: a.publisher?.name || "Unknown Publisher",
      originalUrl: a.originalUrl,
      canonicalUrl: a.canonicalUrl,
      publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
      category: a.category?.name || "General",
      summary: a.summary || "Summary pending extraction.",
      summaryStatus: a.summaryStatus,
      imageUrl: a.imageUrl,
      keywords: a.keywords || [],
      mainTopic: a.mainTopic || null,
    }));

    res.json({
      articles: formatted,
      nextCursor,
      hasMore,
      totalCount,
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to retrieve articles", message: error?.message });
  }
});

// GET /api/articles/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const article = (await prisma.article.findUnique({
      where: { id },
      include: {
        publisher: true,
        category: true,
      },
    })) as any;

    if (!article) {
      res.status(404).json({ error: "Article not found", id });
      return;
    }

    res.json({
      id: article.id,
      title: article.title,
      publisher: article.publisher?.name || "Unknown Publisher",
      originalUrl: article.originalUrl,
      canonicalUrl: article.canonicalUrl,
      publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
      category: article.category?.name || "General",
      summary: article.summary || "Summary pending extraction.",
      summaryStatus: article.summaryStatus,
      imageUrl: article.imageUrl,
      keywords: article.keywords || [],
      mainTopic: article.mainTopic || null,
      content: article.content,
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to retrieve article", message: error?.message });
  }
});

export default router;
