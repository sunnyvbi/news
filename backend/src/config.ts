import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("3001"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/quicknews?schema=public"),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default("gemini-3.8-flash"),
  NEWS_INGESTION_INTERVAL_MINUTES: z.string().default("5"),
  NEWS_INGESTION_ENABLED: z.string().default("true"),
  ADMIN_SECRET: z.string().default("quicknews-admin-secret-2026"),
  CORS_ORIGIN: z.string().default("http://localhost:5173,http://localhost:5174,http://localhost:3000"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:", parsed.error.format());
  process.exit(1);
}

export const config = {
  port: parseInt(parsed.data.PORT, 10),
  nodeEnv: parsed.data.NODE_ENV,
  databaseUrl: parsed.data.DATABASE_URL,
  geminiApiKey: parsed.data.GEMINI_API_KEY || "",
  geminiModel: parsed.data.GEMINI_MODEL,
  ingestionIntervalMinutes: parseInt(parsed.data.NEWS_INGESTION_INTERVAL_MINUTES, 10),
  ingestionEnabled: parsed.data.NEWS_INGESTION_ENABLED.toLowerCase() === "true",
  adminSecret: parsed.data.ADMIN_SECRET,
  corsOrigins: parsed.data.CORS_ORIGIN.split(",").map((s) => s.trim()),
};
