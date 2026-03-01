import {
  getIngestionJobDefinition,
  isDependencySourceJob,
  mergeIngestionJobParams,
  extractPaginationContinuation,
  buildIngestionParamSetsFromDependencies,
} from "@school-analytics/ingestion/domain";

let warnedMissingTelemetryModels = false;
let warnedMissingDependencyCacheModel = false;

function hasDependencyCacheModel(prisma) {
  return Boolean(prisma?.ingestionDependencyCache);
}

function warnMissingDependencyCacheModel(loggerPrefix = "[worker]") {
  if (warnedMissingDependencyCacheModel) return;
  warnedMissingDependencyCacheModel = true;
  console.warn(
    `${loggerPrefix} Prisma client is missing ingestionDependencyCache model; dependency cache persistence is disabled (run prisma generate/migrate)`,
  );
}

function getDependencyCacheKey(source) {
  return `ingestion:dependency:${source}`;
}

function getDependencyCacheTtlSeconds() {
  const raw = Number(process.env.INGESTION_DEPENDENCY_CACHE_TTL_SECONDS ?? 3600);
  if (!Number.isFinite(raw) || raw < 0) {
    return 3600;
  }
  return Math.floor(raw);
}

async function readDependencyCacheFromRedis(redisConnection, source) {
  if (!source || !redisConnection?.get) return null;

  try {
    const raw = await redisConnection.get(getDependencyCacheKey(source));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn(
      `[worker] failed reading dependency cache from Redis for ${source}:`,
      error instanceof Error ? error.message : String(error),
    );
    return null;
  }
}

async function writeDependencyCacheToRedis(redisConnection, source, response) {
  if (!source || !redisConnection?.set) return;

  const payload = JSON.stringify(response);
  const ttlSeconds = getDependencyCacheTtlSeconds();
  try {
    if (ttlSeconds > 0) {
      await redisConnection.set(
        getDependencyCacheKey(source),
        payload,
        "EX",
        ttlSeconds,
      );
    } else {
      await redisConnection.set(getDependencyCacheKey(source), payload);
    }
  } catch (error) {
    console.warn(
      `[worker] failed writing dependency cache to Redis for ${source}:`,
      error instanceof Error ? error.message : String(error),
    );
  }
}

async function readDependencyCacheFromDb(prisma, source, loggerPrefix) {
  if (!source) return null;
  if (!hasDependencyCacheModel(prisma)) {
    warnMissingDependencyCacheModel(loggerPrefix);
    return null;
  }

  try {
    const row = await prisma.ingestionDependencyCache.findUnique({
      where: { source },
    });
    return row?.payload ?? null;
  } catch (error) {
    console.warn(
      `${loggerPrefix} failed reading dependency cache from DB for ${source}:`,
      error instanceof Error ? error.message : String(error),
    );
    return null;
  }
}

async function writeDependencyCacheToDb(prisma, source, response, loggerPrefix) {
  if (!source) return;
  if (!hasDependencyCacheModel(prisma)) {
    warnMissingDependencyCacheModel(loggerPrefix);
    return;
  }

  try {
    await prisma.ingestionDependencyCache.upsert({
      where: { source },
      create: {
        source,
        payload: response,
      },
      update: {
        payload: response,
      },
    });
  } catch (error) {
    console.warn(
      `${loggerPrefix} failed writing dependency cache to DB for ${source}:`,
      error instanceof Error ? error.message : String(error),
    );
  }
}

async function readCachedDependencyResponse({
  source,
  redisConnection,
  prisma,
  loggerPrefix,
}) {
  const fromRedis = await readDependencyCacheFromRedis(redisConnection, source);
  if (fromRedis !== null && fromRedis !== undefined) {
    return { source: "redis", response: fromRedis };
  }

  const fromDb = await readDependencyCacheFromDb(prisma, source, loggerPrefix);
  if (fromDb !== null && fromDb !== undefined) {
    await writeDependencyCacheToRedis(redisConnection, source, fromDb);
    return { source: "database", response: fromDb };
  }

  return null;
}

async function persistDependencyCache({
  source,
  response,
  redisConnection,
  prisma,
  loggerPrefix,
}) {
  if (!source || response === undefined || response === null) {
    return;
  }

  await Promise.allSettled([
    writeDependencyCacheToRedis(redisConnection, source, response),
    writeDependencyCacheToDb(prisma, source, response, loggerPrefix),
  ]);
}

function normalizeDependencyValue(rawValue) {
  const hasResult =
    rawValue &&
    typeof rawValue === "object" &&
    Object.prototype.hasOwnProperty.call(rawValue, "result");
  const hasDependencyResult =
    rawValue &&
    typeof rawValue === "object" &&
    Object.prototype.hasOwnProperty.call(rawValue, "dependencyResult");

  if (
    rawValue &&
    typeof rawValue === "object" &&
    typeof rawValue.type === "string" &&
    (hasResult || hasDependencyResult)
  ) {
    const dependencyResult =
      hasDependencyResult &&
      rawValue.dependencyResult !== undefined &&
      rawValue.dependencyResult !== null
        ? rawValue.dependencyResult
        : rawValue.result;
    return { type: rawValue.type, result: dependencyResult };
  }

  return { type: null, result: rawValue };
}

async function resolveDependencyValuesWithCache({
  definition,
  dependencyValues,
  loggerPrefix,
  redisConnection,
  prisma,
}) {
  const dependencySpecs = definition?.paramsFrom?.dependencies ?? [];
  if (dependencySpecs.length === 0) {
    return dependencyValues;
  }

  const dependencyTypes = [
    ...new Set(
      dependencySpecs
        .map((dependencySpec) => dependencySpec?.jobType)
        .filter(Boolean),
    ),
  ];

  const runtimeByType = new Map();
  for (const rawValue of dependencyValues) {
    const { type, result } = normalizeDependencyValue(rawValue);
    if (!type) {
      continue;
    }

    const bucket = runtimeByType.get(type) ?? [];
    bucket.push(result);
    runtimeByType.set(type, bucket);
  }

  const resolvedByType = new Map();
  for (const dependencyType of dependencyTypes) {
    const runtimeValues = runtimeByType.get(dependencyType) ?? [];
    const combinedValues = [];

    const cached = await readCachedDependencyResponse({
      source: dependencyType,
      redisConnection,
      prisma,
      loggerPrefix,
    });
    if (cached?.response !== null && cached?.response !== undefined) {
      combinedValues.push(cached.response);
      console.log(
        `${loggerPrefix} using cached dependency response for ${dependencyType} from ${cached.source}`,
      );
    }

    if (runtimeValues?.length) {
      combinedValues.push(...runtimeValues);
      const runtimeCachePayload =
        runtimeValues.length === 1 ? runtimeValues[0] : runtimeValues;
      await persistDependencyCache({
        source: dependencyType,
        response: runtimeCachePayload,
        redisConnection,
        prisma,
        loggerPrefix,
      });
    }

    if (combinedValues.length > 0) {
      resolvedByType.set(dependencyType, combinedValues);
    }
  }

  const resolved = [];
  for (const [type, results] of resolvedByType.entries()) {
    for (const result of results) {
      resolved.push({ type, result });
    }
  }

  return resolved;
}

function hasTelemetryModels(prisma) {
  return Boolean(
    prisma?.ingestionRun &&
    prisma?.ingestionCursor &&
    prisma?.ingestionError,
  );
}

function hasRunModel(prisma) {
  return Boolean(prisma?.ingestionRun);
}

function hasCursorModel(prisma) {
  return Boolean(prisma?.ingestionCursor);
}

function hasErrorModel(prisma) {
  return Boolean(prisma?.ingestionError);
}

function warnMissingTelemetryModels(loggerPrefix = "[ingestion]") {
  if (warnedMissingTelemetryModels) return;
  warnedMissingTelemetryModels = true;
  console.warn(
    `${loggerPrefix} ingestion telemetry models are unavailable on Prisma client; run prisma generate/migrate to enable ingestion_runs/ingestion_cursors/ingestion_errors`,
  );
}

function countRecordsInResult(result) {
  if (result == null) {
    return 0;
  }

  if (Array.isArray(result)) {
    return result.length;
  }

  if (typeof result !== "object") {
    return 1;
  }

  const candidates = ["data", "items", "results", "rows", "records", "students"];
  for (const key of candidates) {
    if (Array.isArray(result[key])) {
      return result[key].length;
    }
  }

  return 1;
}

function pickExternalId(params = {}) {
  const keys = ["external_id", "externalId", "id", "studentId", "assignmentId"];
  for (const key of keys) {
    const value = params?.[key];
    if (value !== undefined && value !== null && value !== "") {
      return String(value);
    }
  }
  return null;
}

function serializeError(error) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  return { message: String(error) };
}

export async function createIngestionRun(prisma, source) {
  if (!hasRunModel(prisma)) {
    warnMissingTelemetryModels("[scheduler]");
    return null;
  }
  return prisma.ingestionRun.create({
    data: {
      source,
      status: "QUEUED",
    },
  });
}

export function attachRunIdToFlowNode(flowNode, runId) {
  flowNode.data = {
    ...(flowNode.data ?? {}),
    runId,
  };

  if (Array.isArray(flowNode.children)) {
    for (const child of flowNode.children) {
      attachRunIdToFlowNode(child, runId);
    }
  }

  return flowNode;
}

async function markRunRunning(prisma, runId) {
  if (!runId || !hasRunModel(prisma)) return;

  await prisma.ingestionRun.updateMany({
    where: {
      id: runId,
      status: "QUEUED",
    },
    data: {
      status: "RUNNING",
    },
  });
}

async function incrementRunMetrics(prisma, runId, metrics) {
  if (!runId || !hasRunModel(prisma)) return;

  const {
    recordsFetched = 0,
    recordsProcessed = 0,
    recordsFailed = 0,
  } = metrics ?? {};

  await prisma.ingestionRun.updateMany({
    where: { id: runId },
    data: {
      recordsFetched: { increment: recordsFetched },
      recordsProcessed: { increment: recordsProcessed },
      recordsFailed: { increment: recordsFailed },
    },
  });
}

async function upsertCursorState(prisma, source, cursorValue) {
  if (!source || !hasCursorModel(prisma)) return;

  await prisma.ingestionCursor.upsert({
    where: { source },
    create: {
      source,
      cursorValue,
    },
    update: {
      cursorValue,
    },
  });
}

async function clearCursorState(prisma, source) {
  if (!source || !hasCursorModel(prisma)) return;

  await prisma.ingestionCursor.upsert({
    where: { source },
    create: {
      source,
      cursorValue: null,
    },
    update: {
      cursorValue: null,
    },
  });
}

async function getCursorState(prisma, source) {
  if (!source || !hasCursorModel(prisma)) return null;
  return prisma.ingestionCursor.findUnique({ where: { source } });
}

export async function logIngestionJobFailure(prisma, job, error) {
  const type = job?.data?.type ?? "unknown";
  const params = job?.data?.params ?? {};
  const runId = job?.data?.runId ?? null;

  if (!hasErrorModel(prisma)) {
    warnMissingTelemetryModels("[worker]");
    return;
  }

  await prisma.ingestionError.create({
    data: {
      source: String(type),
      externalId: pickExternalId(params),
      errorMessage:
        error instanceof Error ? error.message : String(error ?? "Unknown error"),
      payload: {
        jobId: job?.id ? String(job.id) : null,
        queueName: job?.queueName ?? null,
        jobName: job?.name ?? null,
        jobData: job?.data ?? null,
        error: serializeError(error),
      },
      runId,
    },
  });

  if (runId) {
    await incrementRunMetrics(prisma, runId, { recordsFailed: 1 });
    await prisma.ingestionRun.updateMany({
      where: {
        id: runId,
        finishedAt: null,
      },
      data: {
        status: "FAILED",
      },
    });
  }
}

export async function finalizeIngestionRun(prisma, runId) {
  if (!runId || !hasRunModel(prisma)) return;

  const run = await prisma.ingestionRun.findUnique({ where: { id: runId } });
  if (!run || run.finishedAt) {
    return;
  }

  const status =
    run.status === "FAILED" || run.recordsFailed > 0 ? "FAILED" : "SUCCESS";

  await prisma.ingestionRun.update({
    where: { id: runId },
    data: {
      status,
      finishedAt: new Date(),
    },
  });
}

export async function finalizeIngestionRuns(prisma, runIds) {
  for (const runId of runIds) {
    await finalizeIngestionRun(prisma, runId);
  }
}

export async function executeTrackedIngestionJob({
  job,
  sourceFactory,
  processorFactory,
  useCase,
  prisma,
  redisConnection = null,
  maxPaginationPages = 1000,
  loggerPrefix = "[worker]",
}) {
  const { type, params = {}, runId } = job.data ?? {};

  if (!hasTelemetryModels(prisma)) {
    warnMissingTelemetryModels(loggerPrefix);
  }

  await markRunRunning(prisma, runId);

  const definition = getIngestionJobDefinition(type);
  const publishDependencyResult = isDependencySourceJob(type);
  const source = sourceFactory.create(type);
  const processor = processorFactory.create(type);
  const baseParams = mergeIngestionJobParams(type, params);

  let dependencyValues = [];
  if (definition?.paramsFrom) {
    try {
      if (typeof job?.getChildrenValues === "function") {
        const childrenValues = await job.getChildrenValues();
        dependencyValues = Object.values(childrenValues ?? {});
      } else {
        console.warn(
          `${loggerPrefix} BullMQ job.getChildrenValues() is unavailable for ${type}; cannot resolve paramsFrom dependencies`,
        );
      }
    } catch (error) {
      console.warn(
        `${loggerPrefix} failed reading Flow dependency results for ${type}:`,
        error instanceof Error ? error.message : String(error),
      );
    }

    dependencyValues = await resolveDependencyValuesWithCache({
      definition,
      dependencyValues,
      loggerPrefix,
      redisConnection,
      prisma,
    });
  }

  const paramSets = buildIngestionParamSetsFromDependencies(
    type,
    dependencyValues,
    baseParams,
  );

  if ((definition?.paramsFrom?.required ?? false) && paramSets.length === 0) {
    console.warn(
      `${loggerPrefix} no dependency values resolved for ${type} (children=${dependencyValues.length})`,
    );
    throw new Error(
      `No dependency-derived params available for ${type}; check dependency jobs and paramsFrom mappings`,
    );
  }

  if (paramSets.length > 1) {
    console.log(
      `${loggerPrefix} expanding ${type} into ${paramSets.length} request(s) from dependencies`,
    );
  }

  let totalPagesProcessed = 0;
  let totalRecordsProcessed = 0;
  let lastResult = null;
  const dependencyResults = publishDependencyResult ? [] : null;
  let paginationMode = "none";

  for (const [index, initialParams] of paramSets.entries()) {
    let effectiveParams = { ...initialParams };
    let page = 0;
    let hitPaginationLimit = true;
    const seenCursors = new Set();

    if (
      definition?.pagination?.type === "cursor" &&
      definition.pagination.persistCursor !== false &&
      paramSets.length === 1
    ) {
      const cursorParam = definition.pagination.cursorParam || "cursor";
      const hasExplicitCursor =
        effectiveParams[cursorParam] !== undefined &&
        effectiveParams[cursorParam] !== null &&
        effectiveParams[cursorParam] !== "";

      if (!hasExplicitCursor) {
        const cursorState = await getCursorState(prisma, type);
        if (cursorState?.cursorValue) {
          effectiveParams = {
            ...effectiveParams,
            [cursorParam]: cursorState.cursorValue,
          };
          console.log(
            `${loggerPrefix} resuming ${type} from stored cursor`,
            cursorState.cursorValue,
          );
        }
      }
    }

    while (page < maxPaginationPages) {
      page += 1;
      totalPagesProcessed += 1;

      const result = await useCase.execute(source, processor, effectiveParams);
      lastResult = result;
      if (dependencyResults) {
        dependencyResults.push(result);
      }

      const pageRecordCount = countRecordsInResult(result);
      totalRecordsProcessed += pageRecordCount;
      if (runId) {
        await incrementRunMetrics(prisma, runId, {
          recordsFetched: pageRecordCount,
          recordsProcessed: pageRecordCount,
        });
      }

      const paginationState = extractPaginationContinuation(type, result, effectiveParams);
      if (!paginationState.enabled) {
        paginationMode = "none";
        hitPaginationLimit = false;
        break;
      }

      paginationMode = paginationState.mode;

      const { mode, hasNextPage, nextParams } = paginationState;
      console.log(
        `${loggerPrefix} ${mode}-paginated ${type} page ${page} on ${job.queueName || "unknown"} (hasNextPage=${hasNextPage}, paramSet=${index + 1}/${paramSets.length})`,
      );

      if (
        mode === "cursor" &&
        definition?.pagination?.persistCursor !== false &&
        paramSets.length === 1
      ) {
        if (hasNextPage && paginationState.nextCursor) {
          await upsertCursorState(prisma, type, String(paginationState.nextCursor));
        } else {
          // Clear on success to avoid reusing a terminal pagination cursor in a future full sync.
          await clearCursorState(prisma, type);
        }
      }

      if (!hasNextPage || !nextParams) {
        hitPaginationLimit = false;
        break;
      }

      if (mode === "cursor") {
        const nextCursor = paginationState.nextCursor;
        if (seenCursors.has(String(nextCursor))) {
          throw new Error(
            `Cursor loop detected for ${type}; repeated cursor "${String(nextCursor)}"`,
          );
        }
        seenCursors.add(String(nextCursor));
      }

      effectiveParams = {
        ...effectiveParams,
        ...nextParams,
      };
    }

    if (hitPaginationLimit && page >= maxPaginationPages) {
      throw new Error(`Pagination exceeded ${maxPaginationPages} pages for ${type}`);
    }
  }

  const dependencyResult = dependencyResults
    ? dependencyResults.length === 0
      ? lastResult
      : dependencyResults.length === 1
        ? dependencyResults[0]
        : dependencyResults
    : null;

  if (publishDependencyResult && dependencyResult !== null && dependencyResult !== undefined) {
    await persistDependencyCache({
      source: type,
      response: dependencyResult,
      redisConnection,
      prisma,
      loggerPrefix,
    });
  }

  return {
    type,
    ...(publishDependencyResult ? { dependencyResult } : {}),
    pagesProcessed: totalPagesProcessed,
    pagination: paginationMode,
    completed: true,
    recordsProcessed: totalRecordsProcessed,
    paramSets: paramSets.length,
  };
}
