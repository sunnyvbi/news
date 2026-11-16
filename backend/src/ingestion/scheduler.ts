import cron from "node-cron";
import { config } from "../config.js";
import { logger } from "../logger.js";
import { runIngestion } from "./worker.js";

let scheduledTask: cron.ScheduledTask | null = null;

export function startScheduler(): void {
  if (!config.ingestionEnabled) {
    logger.info("News ingestion is disabled by configuration");
    return;
  }

  const interval = config.ingestionIntervalMinutes || 5;
  const cronExpr = `*/${interval} * * * *`;

  logger.info({ cronExpr, interval }, "Initializing automated news ingestion scheduler");

  // Run on startup
  runIngestion().catch((err) => {
    logger.error({ err }, "Initial ingestion on startup encountered an error");
  });

  // Schedule recurring execution
  scheduledTask = cron.schedule(cronExpr, async () => {
    logger.info("Triggering scheduled 5-minute news ingestion...");
    await runIngestion();
  });
}

export function stopScheduler(): void {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    logger.info("Ingestion scheduler stopped");
  }
}
