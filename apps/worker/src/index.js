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
    { connection },
  );

  workers.push(worker);
  callbacks_clean(worker, section);
});

function callbacks_clean(worker, queueName) {
  worker.on("ready", () => {
    console.log(`[worker] listening on queue \"${queueName}\"`);
  });

  worker.on("completed", (job) => {
    console.log(`[worker] completed job ${job.id} (${job.name})`);
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
}

async function shutdown(signal, exitCode = 0) {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  console.log(`[worker] received ${signal}, shutting down...`);

  try {
    await Promise.allSettled(workers.map((worker) => worker.close()));
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
