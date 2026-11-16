import { Router, Request, Response } from "express";
import { checkDatabaseConnection } from "../db.js";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const dbConnected = await checkDatabaseConnection();

  const status = dbConnected ? 200 : 503;
  res.status(status).json({
    status: dbConnected ? "healthy" : "degraded",
    database: dbConnected ? "connected" : "disconnected",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    memoryUsage: process.memoryUsage(),
  });
});

export default router;
