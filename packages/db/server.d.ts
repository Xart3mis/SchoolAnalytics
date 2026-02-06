import type pg from "pg";
import type { PrismaClient } from "./src/generated/client";

export function createPrismaClient(options?: {
  connectionString?: string;
  log?: string[];
}): {
  prisma: PrismaClient;
  pool: pg.Pool;
};
