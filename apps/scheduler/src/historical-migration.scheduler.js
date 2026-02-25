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
        "[historical-scheduler] Prisma client is missing ingestionRun model; continuing without ingestion_runs tracking (run prisma generate/migrate)",
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

loadRuntimeEnv("historical-scheduler", ["REDIS_URL", "DATABASE_URL", "HISTORICAL_QUEUE_PREFIX"]);

const redisUrl = process.env.REDIS_URL;
const queuePrefix = process.env.HISTORICAL_QUEUE_PREFIX || "historical";

if (!redisUrl) {
  throw new Error("REDIS_URL is required for historical migration scheduler");
}

const connection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

connection.on("error", (error) => {
  console.error("[historical-scheduler] Redis connection error:", error);
});

const flowProducer = new FlowProducer({ connection });
const flows = buildIngestionFlowForest({
  pipelineName: "historical",
  queuePrefix,
});
const { prisma, pool } = createPrismaClient();

try {
  const run = await createSchedulerRunOrNull(prisma, "toddle:historical");

  if (run?.id) {
    for (const flow of flows) {
      attachRunIdToFlowNode(flow, run.id);
    }
  }

  for (const flow of flows) {
    console.log(
      `[historical-scheduler] enqueue flow root ${flow.name} on ${flow.queueName}`,
    );
    await flowProducer.add(flow);
  }

  console.log(
    `[historical-scheduler] enqueued ${countFlowNodes(flows)} jobs across ${flows.length} flow roots${run?.id ? ` (runId=${run.id})` : ""}`,
  );
} finally {
  await flowProducer.close();
  await connection.quit();
  await prisma.$disconnect();
  await pool.end();
}
