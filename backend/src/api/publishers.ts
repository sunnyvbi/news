import { Router, Request, Response } from "express";
import { prisma } from "../db.js";

const router = Router();

// GET /api/publishers
router.get("/", async (_req: Request, res: Response) => {
  try {
    const publishers = await prisma.publisher.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    res.json({
      publishers: publishers.map((p) => ({
        id: p.id,
        name: p.name,
        website: p.website,
        rssUrl: p.rssUrl,
        articleCount: p._count.articles,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to retrieve publishers", message: error?.message });
  }
});

export default router;
