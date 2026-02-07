const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../../.env"), quiet: true });
dotenv.config({ quiet: true });

const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const { createPrismaClient } = require("@school-analytics/db/server");

const queueName = process.env.POLL_QUEUE_NAME || "polling";
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});

const { prisma, pool } = createPrismaClient();

const worker = new Worker(
  queueName,
  async (job) => {
    if (job.name === "poll-source") {
      const sourceName = String(job.data?.source || "unknown");
      await prisma.sourceSystem.updateMany({
        where: { name: sourceName },
        data: { lastSyncAt: new Date() },
      });
      return { ok: true, source: sourceName };
    }

    if (job.name === "cleanup-expired-sessions") {
      const { count } = await prisma.session.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      });
      return { ok: true, deletedSessions: count };
    }

    return { ok: true, skipped: true };
  },
  { connection }
);

worker.on("ready", () => {
  console.log(`[worker] listening on queue \"${queueName}\"`);
});

worker.on("completed", (job) => {
  console.log(`[worker] completed job ${job.id} (${job.name})`);
});

worker.on("failed", (job, err) => {
  console.error(`[worker] failed job ${job ? job.id : "unknown"}:`, err.message);
});

let shuttingDown = false;

async function shutdown(signal, exitCode = 0) {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  console.log(`[worker] received ${signal}, shutting down...`);
  try {
    await worker.close();
  } catch (error) {
    console.error("[worker] failed to close BullMQ worker:", error);
  }
  try {
    await connection.quit();
  } catch (error) {
    console.error("[worker] failed to close Redis connection:", error);
  }
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error("[worker] failed to disconnect Prisma:", error);
  }
  try {
    await pool.end();
  } catch (error) {
    console.error("[worker] failed to close PG pool:", error);
  }
  process.exit(exitCode);
}

async function shutdownFromFatal(signal, error) {
  console.error(`[worker] ${signal}:`, error);
  await shutdown(signal, 1);
}

connection.on("error", (error) => {
  console.error("[worker] Redis connection error:", error);
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
process.on("uncaughtException", (error) => {
  void shutdownFromFatal("uncaughtException", error);
});
process.on("unhandledRejection", (reason) => {
  const error = reason instanceof Error ? reason : new Error(String(reason));
  void shutdownFromFatal("unhandledRejection", error);
});
