import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import { config } from "./config.js";
import { logger } from "./logger.js";
import articlesRouter from "./api/articles.js";
import categoriesRouter from "./api/categories.js";
import publishersRouter from "./api/publishers.js";
import ingestionRouter from "./api/ingestion.js";
import healthRouter from "./api/health.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.corsOrigins.includes(origin) || config.corsOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.debug({ method: req.method, url: req.url }, "Incoming request");
  next();
});

// Mount API routes
app.use("/api/articles", articlesRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/publishers", publishersRouter);
app.use("/api/ingestion", ingestionRouter);
app.use("/api/health", healthRouter);

// Root informational endpoint
app.get("/", (_req: Request, res: Response) => {
  res.json({
    name: "Quick News API",
    tagline: "Stay informed. Stay ahead.",
    version: "1.0.0",
    docs: "/api/health",
  });
});

// Centralized error handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err }, "Unhandled application error");
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

export default app;
