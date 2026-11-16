import { Router, Request, Response } from "express";
import { prisma } from "../db.js";

const router = Router();

// GET /api/categories
router.get("/", async (_req: Request, res: Response) => {
  try {
    const categories = (await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    })) as any[];

    res.json({
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        articleCount: c._count?.articles ?? 0,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to retrieve categories", message: error?.message });
  }
});

// GET /api/categories/:slug
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const category = (await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    })) as any;

    if (!category) {
      res.status(404).json({ error: "Category not found", slug });
      return;
    }

    res.json({
      id: category.id,
      name: category.name,
      slug: category.slug,
      articleCount: category._count?.articles ?? 0,
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to retrieve category", message: error?.message });
  }
});

export default router;
