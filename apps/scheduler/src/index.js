const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../../.env"), quiet: true });
dotenv.config({ quiet: true });

const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const queueName = process.env.POLL_QUEUE_NAME || "polling";
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const pollIntervalMs = Number(process.env.POLL_INTERVAL_MS || 5 * 60 * 1000);
const sources = (process.env.POLL_SOURCES || "Toddle")
  .split(",")
  .map((source) => source.trim())
  .filter(Boolean);

const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});

const queue = new Queue(queueName, { connection });

async function enqueuePollJobs() {
  for (const source of sources) {
    await queue.upsertJobScheduler(`poll:${source}`, {
      every: pollIntervalMs,
    }, {
      name: "poll-source",
      data: { source },
      opts: {
        removeOnComplete: 100,
        removeOnFail: 200,
      },
    });
  }

  console.log(
    `[scheduler] configured ${sources.length} polling job(s) on \"${queueName}\" every ${pollIntervalMs}ms`
  );
}

enqueuePollJobs().catch((error) => {
  console.error("[scheduler] failed to configure poll jobs:", error);
  process.exit(1);
});

async function shutdown(signal) {
  console.log(`[scheduler] received ${signal}, shutting down...`);
  await queue.close();
  await connection.quit();
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
