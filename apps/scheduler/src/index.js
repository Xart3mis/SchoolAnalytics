import { FlowProducer } from "bullmq";
import Redis from "ioredis";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { createPrismaClient } from "@school-analytics/db/server";
import {
  buildIngestionFlowForest,
  countFlowNodes,
} from "@school-analytics/ingestion/domain";

function attachRunIdToFlowNode(flowNode, runId) {
  flowNode.data = {
    ...(flowNode.data ?? {}),
    runId,
  };

  if (Array.isArray(flowNode.children)) {
    for (const child of flowNode.children) {
      attachRunIdToFlowNode(child, runId);
    }
  }
}

let warnedMissingIngestionRunModel = false;

async function createSchedulerRunOrNull(prisma, source) {
  if (!prisma?.ingestionRun?.create) {
    if (!warnedMissingIngestionRunModel) {
      warnedMissingIngestionRunModel = true;
      console.warn(
        "[scheduler] Prisma client is missing ingestionRun model; continuing without ingestion_runs tracking (run prisma generate/migrate)",
      );
    }
    return null;
  }

  return prisma.ingestionRun.create({
    data: {
      source,
      status: "QUEUED",
    },
  });
}

function parseInterval(value, fallbackMs) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallbackMs;
}

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

loadRuntimeEnv("scheduler", ["REDIS_URL", "DATABASE_URL", "POLL_INTERVAL_MS"]);

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is required for scheduler");
}

const connection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

connection.on("error", (error) => {
  console.error("[scheduler] Redis connection error:", error);
});

const flowProducer = new FlowProducer({ connection });
const { prisma, pool } = createPrismaClient();
const ingestionIntervalMs = parseInterval(
  process.env.POLL_INTERVAL_MS,
  300_000,
);

let enqueueInFlight = false;
let shuttingDown = false;
let intervalId;

async function enqueueIngestionRun() {
  if (shuttingDown || enqueueInFlight) {
    return;
  }
  enqueueInFlight = true;

  try {
    const flows = buildIngestionFlowForest({ pipelineName: "default" });
    const run = await createSchedulerRunOrNull(prisma, "toddle:default");

    if (run?.id) {
      for (const flow of flows) {
        attachRunIdToFlowNode(flow, run.id);
      }
    }

    for (const flow of flows) {
      console.log(
        `[scheduler] enqueue flow root ${flow.name} on ${flow.queueName}`,
      );
      await flowProducer.add(flow);
    }

    console.log(
      `[scheduler] enqueued ${countFlowNodes(flows)} jobs across ${flows.length} flow roots${run?.id ? ` (runId=${run.id})` : ""}`,
    );
  } catch (error) {
    console.error("[scheduler] failed to enqueue ingestion run:", error);
  } finally {
    enqueueInFlight = false;
  }
}

async function shutdown(signal, exitCode = 0) {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  console.log(`[scheduler] received ${signal}, shutting down...`);

  if (intervalId) {
    clearInterval(intervalId);
  }

  try {
    await flowProducer.close();
  } catch (error) {
    console.error("[scheduler] failed to close FlowProducer:", error);
  }
  try {
    await connection.quit();
  } catch (error) {
    console.error("[scheduler] failed to close Redis connection:", error);
  }
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error("[scheduler] failed to disconnect Prisma:", error);
  }
  try {
    await pool.end();
  } catch (error) {
    console.error("[scheduler] failed to close PG pool:", error);
  }

  process.exit(exitCode);
}

try {
  await enqueueIngestionRun();
  intervalId = setInterval(() => {
    void enqueueIngestionRun();
  }, ingestionIntervalMs);
  console.log(
    `[scheduler] polling every ${ingestionIntervalMs}ms for ingestion scheduling`,
  );
} catch (error) {
  console.error("[scheduler] fatal startup error:", error);
  await shutdown("startup", 1);
}

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
