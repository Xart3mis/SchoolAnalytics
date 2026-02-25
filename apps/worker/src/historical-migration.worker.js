import { IngestDataUseCase } from "@school-analytics/ingestion/application";
import {
  SourceFactory,
  AxiosHttpClient,
  ProcessorFactory,
} from "@school-analytics/ingestion/infrastructure";
import {
  buildSectionJobsMap,
} from "@school-analytics/ingestion/domain";
import { createPrismaClient } from "@school-analytics/db/server";
import {
  executeTrackedIngestionJob,
  logIngestionJobFailure,
  finalizeIngestionRuns,
} from "./ingestion-tracking.js";
import dotenv from "dotenv";
import Redis from "ioredis";
import { Queue, Worker } from "bullmq";
import fs from "node:fs";
import path from "node:path";

dotenv.config({ quiet: true });

function loadRuntimeEnv(label, requiredKeys = []) {
  const candidates = [
    process.env.ENV_FILE,
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "..", ".env"),
    path.resolve(process.cwd(), "..", "..", ".env"),
    path.resolve(process.cwd(), "..", "..", "..", ".env"),
  ].filter(Boolean);

  const loadedFrom = [];
  for (const candidate of new Set(candidates)) {
    if (!fs.existsSync(candidate)) continue;
    dotenv.config({ path: candidate, quiet: true });
    loadedFrom.push(candidate);
  }

  const presence = Object.fromEntries(
    requiredKeys.map((key) => [key, Boolean(process.env[key])]),
  );
  console.log(`[${label}] env`, {
    cwd: process.cwd(),
    loadedFrom,
    presence,
  });
}

loadRuntimeEnv("historical-worker", [
  "REDIS_URL",
  "DATABASE_URL",
  "TODDLE_MHIS_API_URL",
  "TODDLE_MHIS_API_KEY",
  "HISTORICAL_QUEUE_PREFIX",
  "INGESTION_CURSOR_MAX_PAGES",
]);

const redisUrl = process.env.REDIS_URL;
const queuePrefix = process.env.HISTORICAL_QUEUE_PREFIX || "historical";

if (!redisUrl) {
  throw new Error("REDIS_URL is required for historical migration worker");
}

const httpClient = new AxiosHttpClient(
  process.env.TODDLE_MHIS_API_URL,
  process.env.TODDLE_MHIS_API_KEY,
);

const sourceFactory = new SourceFactory(httpClient);
const processorFactory = new ProcessorFactory();
const useCase = new IngestDataUseCase();

const connection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

const { prisma, pool } = createPrismaClient();
const maxCursorPages = Number(process.env.INGESTION_CURSOR_MAX_PAGES || 1000);

const queueNames = Object.keys(buildSectionJobsMap("historical")).map(
  (section) => `${queuePrefix}:${section}`,
);

const monitorQueues = queueNames.map(
  (queueName) => new Queue(queueName, { connection }),
);

let failureCount = 0;
let shuttingDown = false;
const touchedRunIds = new Set();

connection.on("error", (error) => {
  console.error("[historical-worker] Redis connection error:", error);
});

async function processJob(job) {
  const { type } = job.data ?? {};

  try {
    if (job?.data?.runId) {
      touchedRunIds.add(job.data.runId);
    }
    return await executeTrackedIngestionJob({
      job,
      sourceFactory,
      processorFactory,
      useCase,
      prisma,
      maxPaginationPages: maxCursorPages,
      loggerPrefix: "[historical-worker]",
    });
  } catch (error) {
    if (error?.name === "ZodError") {
      console.error(`[historical-worker] validation failed for ${type}:`, error.errors);
    }
    try {
      await logIngestionJobFailure(prisma, job, error);
    } catch (telemetryError) {
      console.error(
        "[historical-worker] failed to persist ingestion error:",
        telemetryError,
      );
    }
    throw error;
  }
}

const workers = queueNames.map(
  (queueName) =>
    new Worker(queueName, processJob, {
      connection,
    }),
);

for (const [index, worker] of workers.entries()) {
  const queueName = queueNames[index];

  worker.on("ready", () => {
    console.log(`[historical-worker] listening on ${queueName}`);
  });

  worker.on("completed", (job) => {
    console.log(`[historical-worker] completed job ${job.id} (${job.name})`);
    if (job?.data?.runId) {
      touchedRunIds.add(job.data.runId);
    }
  });

  worker.on("failed", (job, err) => {
    failureCount += 1;
    console.error(
      `[historical-worker] failed job ${job ? job.id : "unknown"} (${job?.name ?? "unknown"}):`,
      err.message,
    );
    if (job?.data?.runId) {
      touchedRunIds.add(job.data.runId);
    }
  });

  worker.on("error", (error) => {
    console.error("[historical-worker] BullMQ worker error:", error);
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getPendingCount() {
  const counts = await Promise.all(
    monitorQueues.map((queue) =>
      queue.getJobCounts(
        "waiting",
        "active",
        "delayed",
        "prioritized",
        "paused",
      ),
    ),
  );

  return counts.reduce(
    (sum, queueCounts) =>
      sum +
      Object.values(queueCounts).reduce(
        (queueSum, value) => queueSum + Number(value || 0),
        0,
      ),
    0,
  );
}

async function waitForDrain() {
  let emptyChecks = 0;

  while (emptyChecks < 2) {
    const pending = await getPendingCount();

    if (pending === 0) {
      emptyChecks += 1;
      if (emptyChecks === 1) {
        console.log("[historical-worker] queues are empty, confirming drain...");
      }
    } else {
      emptyChecks = 0;
      console.log(`[historical-worker] pending jobs: ${pending}`);
    }

    if (emptyChecks < 2) {
      await sleep(1000);
    }
  }
}

async function shutdown(exitCode = 0) {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;

  await Promise.allSettled(workers.map((worker) => worker.close()));
  await Promise.allSettled(monitorQueues.map((queue) => queue.close()));

  try {
    await connection.quit();
  } catch (error) {
    console.error("[historical-worker] failed to close Redis connection:", error);
  }
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error("[historical-worker] failed to disconnect Prisma:", error);
  }
  try {
    await pool.end();
  } catch (error) {
    console.error("[historical-worker] failed to close PG pool:", error);
  }

  process.exit(exitCode);
}

process.on("SIGINT", () => {
  void shutdown(1);
});

process.on("SIGTERM", () => {
  void shutdown(1);
});

process.on("uncaughtException", (error) => {
  console.error("[historical-worker] uncaughtException:", error);
  void shutdown(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[historical-worker] unhandledRejection:", reason);
  void shutdown(1);
});

try {
  console.log(
    `[historical-worker] waiting for historical queues (${queueNames.join(", ")})`,
  );
  await waitForDrain();
  if (touchedRunIds.size > 0) {
    await finalizeIngestionRuns(prisma, [...touchedRunIds]);
  }
  console.log("[historical-worker] historical migration jobs drained");
  await shutdown(failureCount > 0 ? 1 : 0);
} catch (error) {
  console.error("[historical-worker] fatal error:", error);
  await shutdown(1);
}
