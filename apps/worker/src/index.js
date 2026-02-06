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

async function shutdown(signal) {
  console.log(`[worker] received ${signal}, shutting down...`);
  await worker.close();
  await connection.quit();
  await prisma.$disconnect();
  await pool.end();
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
