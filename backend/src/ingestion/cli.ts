import { runIngestion } from "./worker.js";
import { prisma } from "../db.js";
import { logger } from "../logger.js";

async function main() {
  logger.info("Executing standalone Quick News ingestion run...");
  try {
    const stats = await runIngestion();
    console.log("Ingestion completed with results:", stats);
  } catch (error) {
    console.error("Ingestion failed:", error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
