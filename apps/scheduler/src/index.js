const path = require("path");
const { randomUUID } = require("crypto");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../../.env"), quiet: true });
dotenv.config({ quiet: true });

const { Queue } = require("bullmq");
const IORedis = require("ioredis");

function parseInterval(value, fallbackMs) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallbackMs;
}

const queueName = process.env.POLL_QUEUE_NAME || "polling";
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const pollIntervalMs = parseInterval(process.env.POLL_INTERVAL_MS, 5 * 60 * 1000);
const sessionCleanupIntervalMs = parseInterval(
  process.env.SESSION_CLEANUP_INTERVAL_MS,
  60 * 60 * 1000
);
const sources = (process.env.POLL_SOURCES || "Toddle")
  .split(",")
  .map((source) => source.trim())
  .filter(Boolean);
const schedulerLockKey = `${queueName}:scheduler:bootstrap-lock`;
const schedulerLockTtlMs = parseInterval(process.env.SCHEDULER_BOOTSTRAP_LOCK_TTL_MS, 30_000);
const schedulerLockToken = randomUUID();

const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});

const queue = new Queue(queueName, { connection });

async function acquireBootstrapLock() {
  const result = await connection.set(
    schedulerLockKey,
    schedulerLockToken,
    "PX",
    schedulerLockTtlMs,
    "NX"
  );
  return result === "OK";
}

async function releaseBootstrapLock() {
  try {
    await connection.eval(
      `
        if redis.call("GET", KEYS[1]) == ARGV[1] then
          return redis.call("DEL", KEYS[1])
        end
        return 0
      `,
      1,
      schedulerLockKey,
      schedulerLockToken
    );
  } catch (error) {
    console.error("[scheduler] failed to release bootstrap lock:", error);
  }
}

async function enqueuePollJobs() {
  const hasLock = await acquireBootstrapLock();
  if (!hasLock) {
    console.log("[scheduler] another instance is configuring jobs; skipping bootstrap");
    return;
  }

  try {
    for (const source of sources) {
      await queue.upsertJobScheduler(
        `poll:${source}`,
        {
          every: pollIntervalMs,
        },
        {
          name: "poll-source",
          data: { source },
          opts: {
            removeOnComplete: 100,
            removeOnFail: 200,
          },
        }
      );
    }

    await queue.upsertJobScheduler(
      "maintenance:expired-sessions",
      {
        every: sessionCleanupIntervalMs,
      },
      {
        name: "cleanup-expired-sessions",
        data: {},
        opts: {
          removeOnComplete: 100,
          removeOnFail: 200,
        },
      },
    );

    console.log(
      `[scheduler] configured ${sources.length} polling job(s) and session cleanup on "${queueName}" (poll=${pollIntervalMs}ms, cleanup=${sessionCleanupIntervalMs}ms)`
    );
  } finally {
    await releaseBootstrapLock();
  }
}

enqueuePollJobs().catch((error) => {
  console.error("[scheduler] failed to configure poll jobs:", error);
  process.exit(1);
});

async function shutdown(signal, exitCode = 0) {
  if (shutdown.inFlight) {
    return;
  }
  shutdown.inFlight = true;
  console.log(`[scheduler] received ${signal}, shutting down...`);
  try {
    await queue.close();
  } catch (error) {
    console.error("[scheduler] failed to close queue:", error);
  }
  try {
    await connection.quit();
  } catch (error) {
    console.error("[scheduler] failed to close Redis connection:", error);
  }
  process.exit(exitCode);
}
shutdown.inFlight = false;

connection.on("error", (error) => {
  console.error("[scheduler] Redis connection error:", error);
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
process.on("uncaughtException", (error) => {
  console.error("[scheduler] uncaughtException:", error);
  void shutdown("uncaughtException", 1);
});
process.on("unhandledRejection", (reason) => {
  console.error("[scheduler] unhandledRejection:", reason);
  void shutdown("unhandledRejection", 1);
});
