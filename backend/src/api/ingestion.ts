import { Router, Request, Response } from "express";
import { runIngestion } from "../ingestion/worker.js";
import { prisma } from "../db.js";
import { config } from "../config.js";

const router = Router();

// Middleware to verify admin secret for ingestion trigger
function requireAdmin(req: Request, res: Response, next: Function) {
  const secret = req.headers["x-admin-secret"] || req.query.admin_secret;
  if (!secret || secret !== config.adminSecret) {
    res.status(401).json({ error: "Unauthorized admin access" });
    return;
  }
  next();
}

// POST /api/ingestion/run
router.post("/run", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const stats = await runIngestion();
    res.json({ message: "Ingestion completed", ...stats });
  } catch (error: any) {
    res.status(500).json({ error: "Ingestion failed", message: error?.message });
  }
});

// GET /api/ingestion/logs
router.get("/logs", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const logs = await prisma.ingestionLog.findMany({
      take: 50,
      orderBy: { startedAt: "desc" },
    });
    res.json({ logs });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to retrieve logs", message: error?.message });
  }
});

export default router;
