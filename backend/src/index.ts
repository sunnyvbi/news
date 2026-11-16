import { app } from "./app.js";
import { config } from "./config.js";
import { logger } from "./logger.js";
import { prisma, checkDatabaseConnection } from "./db.js";
import { startScheduler, stopScheduler } from "./ingestion/scheduler.js";

async function startServer() {
  const isConnected = await checkDatabaseConnection();
  if (isConnected) {
    logger.info("Connected to PostgreSQL database successfully");
  } else {
    logger.warn("Database not reachable yet. Please ensure PostgreSQL is running (e.g. via docker compose up -d)");
  }

  const server = app.listen(config.port, () => {
    logger.info(`Quick News API listening on port ${config.port} (${config.nodeEnv})`);
    logger.info(`Gemini Model configured: ${config.geminiModel}`);
    logger.info(`Scheduled automated ingestion: every ${config.ingestionIntervalMinutes} minutes`);
    
    // Start automated 5-minute RSS ingestion worker
    startScheduler();
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Commencing graceful shutdown...`);
    stopScheduler();
    server.close(async () => {
      await prisma.$disconnect();
      logger.info("Server closed and database disconnected cleanly.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

startServer().catch((error) => {
  logger.error({ error }, "Failed to start server");
  process.exit(1);
});
