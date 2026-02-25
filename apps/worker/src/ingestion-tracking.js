import {
  getIngestionJobDefinition,
  mergeIngestionJobParams,
  extractPaginationContinuation,
  buildIngestionParamSetsFromDependencies,
} from "@school-analytics/ingestion/domain";

let warnedMissingTelemetryModels = false;

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
  maxPaginationPages = 1000,
  loggerPrefix = "[worker]",
}) {
  const { type, params = {}, runId } = job.data ?? {};

  if (!hasTelemetryModels(prisma)) {
    warnMissingTelemetryModels(loggerPrefix);
  }

  await markRunRunning(prisma, runId);

  const definition = getIngestionJobDefinition(type);
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

  return {
    type,
    result: lastResult,
    pagesProcessed: totalPagesProcessed,
    pagination: paginationMode,
    completed: true,
    recordsProcessed: totalRecordsProcessed,
    paramSets: paramSets.length,
  };
}
