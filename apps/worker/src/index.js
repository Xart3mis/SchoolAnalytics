import { IngestDataUseCase } from "@school-analytics/ingestion/application";
import {
  SourceFactory,
  AxiosHttpClient,
  // DefaultProcessor,
  ProcessorFactory,
} from "@school-analytics/ingestion/infrastructure";
import { section_jobs } from "@school-analytics/ingestion/domain";
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

loadRuntimeEnv("worker", [
  "REDIS_URL",
  "DATABASE_URL",
  "TODDLE_MHIS_API_URL",
  "TODDLE_MHIS_API_KEY",
  "INGESTION_CURSOR_MAX_PAGES",
]);

const redisUrl = process.env.REDIS_URL;

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
const monitorQueues = Object.keys(section_jobs).map(
  (section) => new Queue(section, { connection }),
);
const touchedRunIds = new Set();
let finalizingRuns = false;
let shuttingDown = false;
const workers = [];

function parsePositiveInt(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

function parseNonNegativeInt(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : fallback;
}

const shutdownGraceMs = parsePositiveInt(
  process.env.WORKER_SHUTDOWN_GRACE_MS,
  15000,
);
const shutdownForceExitMs = parsePositiveInt(
  process.env.WORKER_SHUTDOWN_FORCE_EXIT_MS,
  30000,
);
const workerLockDurationMs = parsePositiveInt(
  process.env.WORKER_LOCK_DURATION_MS,
  300000,
);
const workerStalledIntervalMs = parsePositiveInt(
  process.env.WORKER_STALLED_INTERVAL_MS,
  30000,
);
const workerMaxStalledCount = parseNonNegativeInt(
  process.env.WORKER_MAX_STALLED_COUNT,
  5,
);
const workerConcurrency = parsePositiveInt(process.env.WORKER_CONCURRENCY, 1);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function settleWithTimeout(promises, timeoutMs) {
  const settled = Promise.allSettled(promises);
  const timedOut = await Promise.race([
    settled.then(() => false),
    sleep(timeoutMs).then(() => true),
  ]);

  if (timedOut) {
    return { timedOut: true };
  }

  await settled;
  return { timedOut: false };
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

async function maybeFinalizeRunsWhenIdle() {
  if (finalizingRuns || touchedRunIds.size === 0) {
    return;
  }

  finalizingRuns = true;
  try {
    const pending = await getPendingCount();
    if (pending > 0) {
      return;
    }

    const runIds = [...touchedRunIds];
    await finalizeIngestionRuns(prisma, runIds);
    for (const runId of runIds) {
      touchedRunIds.delete(runId);
    }
  } finally {
    finalizingRuns = false;
  }
}

Object.keys(section_jobs).forEach((section) => {
  const worker = new Worker(
    section,
    async (job) => {
      const { type } = job.data ?? {};

      try {
        if (job?.data?.runId) {
          touchedRunIds.add(job.data.runId);
        }
        const result = await executeTrackedIngestionJob({
          job,
          sourceFactory,
          processorFactory,
          useCase,
          prisma,
          redisConnection: connection,
          maxPaginationPages: maxCursorPages,
          loggerPrefix: "[worker]",
        });
        console.log(result);
        return result;
      } catch (error) {
        if (error?.name === "ZodError") {
          console.error(`Validation failed for ${type}:`, error.errors); // You can decide to fail the job or move to a Dead Letter Queue
        }

        try {
          await logIngestionJobFailure(prisma, job, error);
        } catch (telemetryError) {
          console.error(
            "[worker] failed to persist ingestion error:",
            telemetryError,
          );
        }

        throw error; // Re-throw for BullMQ retries
      }
    },
    {
      connection,
      lockDuration: workerLockDurationMs,
      stalledInterval: workerStalledIntervalMs,
      maxStalledCount: workerMaxStalledCount,
      concurrency: workerConcurrency,
    },
  );

  workers.push(worker);
  callbacks_clean(worker, section);
});

function callbacks_clean(worker, queueName) {
  worker.on("ready", () => {
    console.log(`[worker] listening on queue \"${queueName}\"`);
    console.log(
      `[worker] queue settings ${queueName}: lockDuration=${workerLockDurationMs}ms stalledInterval=${workerStalledIntervalMs}ms maxStalledCount=${workerMaxStalledCount} concurrency=${workerConcurrency}`,
    );
  });

  worker.on("completed", (job) => {
    const output = job?.returnvalue;
    const summary = output && typeof output === "object"
      ? {
          pagesProcessed: output.pagesProcessed,
          recordsProcessed: output.recordsProcessed,
          paramSets: output.paramSets,
          pagination: output.pagination,
        }
      : null;
    console.log(
      `[worker] completed job ${job.id} (${job.name})${summary ? ` ${JSON.stringify(summary)}` : ""}`,
    );
    if (job?.data?.runId) {
      touchedRunIds.add(job.data.runId);
    }
    void maybeFinalizeRunsWhenIdle();
  });

  worker.on("failed", (job, err) => {
    console.error(
      `[worker] failed job ${job ? job.id : "unknown"} (${job.name}):`,
      err.message,
    );
    if (job?.data?.runId) {
      touchedRunIds.add(job.data.runId);
    }
    void maybeFinalizeRunsWhenIdle();
  });

  worker.on("stalled", (jobId, prev) => {
    console.warn(
      `[worker] stalled job ${jobId} on ${queueName}${prev ? ` (prev=${prev})` : ""}`,
    );
  });
}

async function shutdown(signal, exitCode = 0) {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  console.log(`[worker] received ${signal}, shutting down...`);

  const forceExitCode = exitCode === 0 ? 1 : exitCode;
  const forcedExitTimer = setTimeout(() => {
    console.error(
      `[worker] shutdown exceeded ${shutdownForceExitMs}ms; forcing exit`,
    );
    process.exit(forceExitCode);
  }, shutdownForceExitMs);

  try {
    await Promise.allSettled(workers.map((worker) => worker.pause(true)));
  } catch (error) {
    console.error("[worker] failed to pause BullMQ workers:", error);
  }

  try {
    const workerClose = await settleWithTimeout(
      workers.map((worker) => worker.close()),
      shutdownGraceMs,
    );
    if (workerClose.timedOut) {
      console.warn(
        `[worker] graceful worker close exceeded ${shutdownGraceMs}ms; forcing close`,
      );
      await Promise.allSettled(workers.map((worker) => worker.close(true)));
    }
  } catch (error) {
    console.error("[worker] failed to close BullMQ workers:", error);
  }
  try {
    await Promise.allSettled(monitorQueues.map((queue) => queue.close()));
  } catch (error) {
    console.error("[worker] failed to close monitor queues:", error);
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

  clearTimeout(forcedExitTimer);
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
