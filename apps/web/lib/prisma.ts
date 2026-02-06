import type { PrismaClient } from "@school-analytics/db/client";
import { createPrismaClient } from "@school-analytics/db/server";

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient({
    connectionString: process.env.DATABASE_URL,
    log: ["error"],
  }).prisma;

if (process.env.NODE_ENV !== "production" && !globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}
