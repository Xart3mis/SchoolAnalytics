export * from "./interfaces/index.js";

export const ingestion_job_definitions = {
  assignments: {
    section: "assignments",
    dependsOn: ["curriculum"],
    params: {
      count: 400,
    },
    paramsFrom: {
      required: true,
      mode: "fanout",
      dependencies: [
        {
          jobType: "curriculum",
          itemsPath: ["response", "curriculums"],
          itemValuePath: ["id"],
          param: "curriculumProgramId",
        },
      ],
    },
    pagination: {
      type: "cursor",
      cursorParam: "cursor",
      nextCursorPath: ["pageInfo", "endCursor"],
      hasNextPagePath: ["pageInfo", "hasNextPage"],
      persistCursor: false,
    },
  },
  // "assignment-by-id": {
  //   section: "assignments",
  //   dependsOn: ["assignments"],
  // },
  "student-assignments": {
    section: "assignments",
    dependsOn: ["curriculum"],
    params: {
      count: 100,
    },
    paramsFrom: {
      required: true,
      mode: "fanout",
      dependencies: [
        {
          jobType: "curriculum",
          itemsPath: ["response", "curriculums"],
          itemValuePath: ["id"],
          param: "curriculumProgramId",
        },
      ],
    },
    pagination: {
      type: "cursor",
      cursorParam: "cursor",
      nextCursorPath: ["pageInfo", "endCursor"],
      hasNextPagePath: ["pageInfo", "hasNextPage"],
      persistCursor: false,
    },
  },
  // "student-assignment-by-student-id": {
  //   section: "assignments",
  //   dependsOn: ["student-assignments"],
  // },
  grades: {
    section: "academics",
    dependsOn: [],
  },
  "org-roles": {
    section: "academics",
    dependsOn: [],
  },
  curriculum: {
    section: "academics",
    dependsOn: [],
  },
  "year-groups": {
    section: "academics",
    dependsOn: [],
  },
  "academic-years": {
    section: "academics",
    dependsOn: [],
  },
  "grading-periods": {
    section: "academics",
    dependsOn: ["curriculum", "academic-years"],
    paramsFrom: {
      required: true,
      mode: "cross",
      dependencies: [
        {
          jobType: "curriculum",
          itemsPath: ["response", "curriculums"],
          itemValuePath: ["id"],
          param: "curriculumProgramId",
        },
        {
          jobType: "academic-years",
          itemsPath: ["response", "academicYears"],
          itemValuePath: ["id"],
          param: "academicYearId",
        },
      ],
    },
  },
  "progress-summary": {
    section: "gradebook",
    dependsOn: ["grading-periods"],
    params: {
      count: 4000,
    },
    paramsFrom: {
      required: true,
      mode: "fanout",
      dependencies: [
        {
          jobType: "grading-periods",
          itemsPath: ["response"],
          fields: {
            curriculumProgramId: ["curriculumProgramId"],
            academicYearId: ["academicYearId"],
            gradingPeriodId: ["id"],
          },
        },
      ],
    },
    pagination: {
      type: "cursor",
      cursorParam: "cursor",
      nextCursorPath: ["pageInfo", "endCursor"],
      hasNextPagePath: ["pageInfo", "hasNextPage"],
      persistCursor: false,
    },
  },
  courses: {
    section: "course",
    dependsOn: [],
  },
  "course-students": {
    section: "course",
    dependsOn: ["courses"],
    paramsFrom: {
      required: true,
      mode: "fanout",
      dependencies: [
        {
          jobType: "courses",
          itemsPath: ["response", "courses"],
          coerceObjectToArray: true,
          itemValuePath: ["id"],
          param: "id",
        },
      ],
    },
  },
  // students: {
  //   section: "students",
  //   dependsOn: [],
  //   params: { pageNumber: 1, pageSize: 400 },
  //   pagination: {
  //     type: "page",
  //     pageParam: "pageNumber",
  //     pageSizeParam: "pageSize",
  //     // Set this to the actual array path once a Toddle students response is captured.
  //     itemsPath: ["data"],
  //   },
  // },
  // "student-other-info": {
  //   section: "students",
  //   dependsOn: ["students"],
  // },
  // "teacher-notes-for-student": {
  //   section: "students",
  //   dependsOn: ["students"],
  // },
  // "subject-groups": {
  //   section: "subjects",
  //   dependsOn: [],
  // },
  // subjects: {
  //   section: "subjects",
  //   dependsOn: [],
  // },
  // "flag-types": {
  //   section: "student-flags",
  //   dependsOn: [],
  // },
  // "student-flag": {
  //   section: "student-flags",
  //   dependsOn: ["flag-types"],
  //   params: { first: 100 },
  //   pagination: {
  //     type: "cursor",
  //     cursorParam: "after",
  //     nextCursorPath: ["pageInfo", "endCursor"],
  //     hasNextPagePath: ["pageInfo", "hasNextPage"],
  //   },
  // },
  // "grade-scale": {
  //   section: "term-grades",
  //   dependsOn: [],
  // },
  // "term-grades": {
  //   section: "term-grades",
  //   dependsOn: ["grade-scale", "grading-periods"],
  //   params: { count: 100 },
  //   pagination: {
  //     type: "cursor",
  //     cursorParam: "cursor",
  //     nextCursorPath: ["pageInfo", "endCursor"],
  //     hasNextPagePath: ["pageInfo", "hasNextPage"],
  //   },
  // },
};

export const ingestion_pipelines = {
  default: [
    "assignments",
    "student-assignments",
    "grades",
    "org-roles",
    "curriculum",
    "year-groups",
    "academic-years",
    "grading-periods",
    "progress-summary",
    "courses",
    "course-students",
  ],
  historical: [
    "curriculum",
    "academic-years",
    "year-groups",
    "grades",
    "org-roles",
    "grading-periods",
    "courses",
    "course-students",
    "assignments",
    "student-assignments",
    "progress-summary",
  ],
};

function getPipelineJobTypes(pipelineName = "default") {
  const jobTypes = ingestion_pipelines[pipelineName];
  if (!jobTypes) {
    throw new Error(`Unknown ingestion pipeline: ${pipelineName}`);
  }
  return jobTypes;
}

export function getIngestionJobDefinition(jobType) {
  return ingestion_job_definitions[jobType] ?? null;
}

export function mergeIngestionJobParams(jobType, params = {}) {
  const definition = getIngestionJobDefinition(jobType);
  return {
    ...(definition?.params ?? {}),
    ...(params ?? {}),
  };
}

function normalizeDependencyResult(value) {
  if (
    value &&
    typeof value === "object" &&
    typeof value.type === "string" &&
    Object.prototype.hasOwnProperty.call(value, "result")
  ) {
    return {
      type: value.type,
      result: value.result,
    };
  }

  return {
    type: null,
    result: value,
  };
}

function toArray(value, { coerceObjectToArray = false } = {}) {
  if (Array.isArray(value)) {
    return value;
  }
  if (
    coerceObjectToArray &&
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    return [value];
  }
  return [];
}

function buildDependencyFragments(dependencySpec, dependencyResultsByType) {
  const {
    jobType,
    itemsPath,
    itemValuePath,
    param,
    fields,
    coerceObjectToArray = false,
  } = dependencySpec ?? {};

  if (!jobType || (!param && !fields)) {
    return [];
  }

  const parentResults = dependencyResultsByType.get(jobType) ?? [];
  const values = [];

  for (const parentResult of parentResults) {
    const container = Array.isArray(itemsPath) ? getByPath(parentResult, itemsPath) : parentResult;
    const items = toArray(container, { coerceObjectToArray });

    for (const item of items) {
      if (fields && typeof fields === "object") {
        const fragment = {};
        for (const [fieldName, fieldPath] of Object.entries(fields)) {
          const fieldValue = Array.isArray(fieldPath) ? getByPath(item, fieldPath) : item?.[fieldPath];
          if (
            fieldValue === undefined ||
            fieldValue === null ||
            fieldValue === ""
          ) {
            continue;
          }
          fragment[fieldName] = String(fieldValue);
        }
        if (Object.keys(fragment).length > 0) {
          values.push(fragment);
        }
        continue;
      }

      const value = Array.isArray(itemValuePath) ? getByPath(item, itemValuePath) : item;
      if (value === undefined || value === null || value === "") {
        continue;
      }
      values.push({ [param]: String(value) });
    }
  }

  const deduped = new Map();
  for (const fragment of values) {
    const key = JSON.stringify(fragment);
    if (!deduped.has(key)) {
      deduped.set(key, fragment);
    }
  }
  return [...deduped.values()];
}

function cartesianMerge(baseParams, fragmentGroups) {
  let result = [{ ...(baseParams ?? {}) }];

  for (const fragments of fragmentGroups) {
    if (!Array.isArray(fragments) || fragments.length === 0) {
      return [];
    }

    const next = [];
    for (const partial of result) {
      for (const fragment of fragments) {
        next.push({
          ...partial,
          ...fragment,
        });
      }
    }
    result = next;
  }

  return result;
}

export function buildIngestionParamSetsFromDependencies(
  jobType,
  dependencyValues = [],
  baseParams = {},
) {
  const definition = getIngestionJobDefinition(jobType);
  const paramsFrom = definition?.paramsFrom;

  if (!paramsFrom) {
    return [{ ...(baseParams ?? {}) }];
  }

  const dependencyResultsByType = new Map();

  for (const rawValue of dependencyValues) {
    const { type, result } = normalizeDependencyResult(rawValue);
    if (!type) {
      continue;
    }
    const bucket = dependencyResultsByType.get(type) ?? [];
    bucket.push(result);
    dependencyResultsByType.set(type, bucket);
  }

  const fragmentGroups = (paramsFrom.dependencies ?? []).map((dependencySpec) =>
    buildDependencyFragments(dependencySpec, dependencyResultsByType),
  );

  const mode = paramsFrom.mode || "fanout";
  if (mode === "cross") {
    const paramSets = cartesianMerge(baseParams, fragmentGroups);
    if (paramSets.length > 0) {
      return paramSets;
    }
    return paramsFrom.required ? [] : [{ ...(baseParams ?? {}) }];
  }

  if (fragmentGroups.length === 0) {
    return [{ ...(baseParams ?? {}) }];
  }

  if (fragmentGroups.length > 1) {
    // For fanout, merge fragment groups left-to-right by index if multiple are configured.
    const max = Math.max(...fragmentGroups.map((group) => group.length), 0);
    if (max === 0) {
      return paramsFrom.required ? [] : [{ ...(baseParams ?? {}) }];
    }
    const merged = [];
    for (let i = 0; i < max; i += 1) {
      const next = { ...(baseParams ?? {}) };
      for (const group of fragmentGroups) {
        if (group[i]) {
          Object.assign(next, group[i]);
        }
      }
      merged.push(next);
    }
    return merged;
  }

  const [fragments] = fragmentGroups;
  if (!fragments || fragments.length === 0) {
    return paramsFrom.required ? [] : [{ ...(baseParams ?? {}) }];
  }

  return fragments.map((fragment) => ({
    ...(baseParams ?? {}),
    ...fragment,
  }));
}

function getByPath(value, path) {
  if (!Array.isArray(path) || path.length === 0) {
    return undefined;
  }

  let current = value;
  for (const key of path) {
    if (current == null || typeof current !== "object") {
      return undefined;
    }
    current = current[key];
  }
  return current;
}

export function extractCursorContinuation(jobType, result) {
  const definition = getIngestionJobDefinition(jobType);
  const pagination = definition?.pagination;

  if (!pagination) {
    return {
      enabled: false,
      mode: "none",
      hasNextPage: false,
      nextParams: null,
    };
  }

  if (pagination.type === "page") {
    const pageParam = pagination.pageParam || "pageNumber";
    const pageSizeParam = pagination.pageSizeParam || "pageSize";
    const initialPage = Number(pagination.initialPage ?? 1);

    return {
      enabled: true,
      mode: "page",
      pageParam,
      pageSizeParam,
      initialPage,
      hasNextPage: false,
      nextParams: null,
    };
  }

  if (pagination.type !== "cursor") {
    return {
      enabled: false,
      mode: "none",
      hasNextPage: false,
      nextParams: null,
    };
  }

  const nextCursorCandidates = [
    pagination.nextCursorPath,
    ["pageInfo", "endCursor"],
    ["data", "pageInfo", "endCursor"],
    ["meta", "pageInfo", "endCursor"],
    ["pagination", "endCursor"],
    ["endCursor"],
    ["nextCursor"],
  ].filter(Boolean);

  const hasNextPageCandidates = [
    pagination.hasNextPagePath,
    ["pageInfo", "hasNextPage"],
    ["data", "pageInfo", "hasNextPage"],
    ["meta", "pageInfo", "hasNextPage"],
    ["pagination", "hasNextPage"],
    ["hasNextPage"],
  ].filter(Boolean);

  let nextCursor;
  for (const path of nextCursorCandidates) {
    const value = getByPath(result, path);
    if (value !== undefined && value !== null && value !== "") {
      nextCursor = value;
      break;
    }
  }

  let hasNextPage;
  for (const path of hasNextPageCandidates) {
    const value = getByPath(result, path);
    if (typeof value === "boolean") {
      hasNextPage = value;
      break;
    }
  }

  if (hasNextPage === undefined) {
    hasNextPage = Boolean(nextCursor);
  }

  return {
    enabled: true,
    mode: "cursor",
    cursorParam: pagination.cursorParam || "cursor",
    hasNextPage,
    nextCursor: hasNextPage ? (nextCursor ?? null) : null,
    nextParams:
      hasNextPage && nextCursor
        ? { [pagination.cursorParam || "cursor"]: nextCursor }
        : null,
  };
}

function getFirstArrayCandidate(value, preferredPath) {
  if (Array.isArray(preferredPath)) {
    const preferred = getByPath(value, preferredPath);
    if (Array.isArray(preferred)) {
      return preferred;
    }
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (value == null || typeof value !== "object") {
    return null;
  }

  const keys = ["data", "items", "results", "rows", "records", "students"];
  for (const key of keys) {
    if (Array.isArray(value[key])) {
      return value[key];
    }
  }

  return null;
}

export function extractPaginationContinuation(jobType, result, currentParams = {}) {
  const definition = getIngestionJobDefinition(jobType);
  const pagination = definition?.pagination;

  if (!pagination) {
    return {
      enabled: false,
      mode: "none",
      hasNextPage: false,
      nextParams: null,
    };
  }

  if (pagination.type === "cursor") {
    return extractCursorContinuation(jobType, result);
  }

  if (pagination.type !== "page") {
    return {
      enabled: false,
      mode: "none",
      hasNextPage: false,
      nextParams: null,
    };
  }

  const pageParam = pagination.pageParam || "pageNumber";
  const pageSizeParam = pagination.pageSizeParam || "pageSize";
  const initialPage = Number(pagination.initialPage ?? 1);
  const currentPage = Number(currentParams?.[pageParam] ?? initialPage);
  const currentPageSize = Number(currentParams?.[pageSizeParam] ?? 0);

  const hasNextPageCandidates = [
    pagination.hasNextPagePath,
    ["pageInfo", "hasNextPage"],
    ["data", "pageInfo", "hasNextPage"],
    ["meta", "pageInfo", "hasNextPage"],
    ["pagination", "hasNextPage"],
    ["pagination", "hasMore"],
    ["hasNextPage"],
    ["hasMore"],
  ].filter(Boolean);

  const totalPagesCandidates = [
    pagination.totalPagesPath,
    ["pagination", "totalPages"],
    ["meta", "totalPages"],
    ["pageInfo", "totalPages"],
    ["totalPages"],
  ].filter(Boolean);

  let hasNextPage;
  for (const path of hasNextPageCandidates) {
    const value = getByPath(result, path);
    if (typeof value === "boolean") {
      hasNextPage = value;
      break;
    }
  }

  if (hasNextPage === undefined) {
    for (const path of totalPagesCandidates) {
      const value = Number(getByPath(result, path));
      if (Number.isFinite(value) && value > 0) {
        hasNextPage = currentPage < value;
        break;
      }
    }
  }

  if (hasNextPage === undefined) {
    const rows = getFirstArrayCandidate(result, pagination.itemsPath);
    if (rows && currentPageSize > 0) {
      hasNextPage = rows.length >= currentPageSize;
    }
  }

  if (hasNextPage === undefined) {
    hasNextPage = false;
  }

  const nextPage = hasNextPage ? currentPage + 1 : null;

  return {
    enabled: true,
    mode: "page",
    pageParam,
    pageSizeParam,
    hasNextPage,
    nextPage,
    nextParams: hasNextPage ? { [pageParam]: nextPage } : null,
  };
}

function getQueueName(section, queuePrefix = "") {
  return queuePrefix ? `${queuePrefix}:${section}` : section;
}

function validatePipelineDefinitions(jobTypes) {
  const pipelineSet = new Set(jobTypes);
  const dependencyParents = new Map();

  for (const jobType of jobTypes) {
    const definition = ingestion_job_definitions[jobType];
    if (!definition) {
      throw new Error(`Missing ingestion job definition for: ${jobType}`);
    }

    for (const dependency of definition.dependsOn ?? []) {
      if (!ingestion_job_definitions[dependency]) {
        throw new Error(
          `Job "${jobType}" depends on unknown job "${dependency}"`,
        );
      }
      if (!pipelineSet.has(dependency)) {
        throw new Error(
          `Job "${jobType}" depends on "${dependency}" which is missing from the pipeline`,
        );
      }

      const parents = dependencyParents.get(dependency) ?? [];
      parents.push(jobType);
      dependencyParents.set(dependency, parents);
    }
  }

  // Shared dependencies are allowed, but FlowProducer will duplicate them in each
  // parent tree because it models trees, not DAGs.
}

function buildFlowNode(jobType, options, trail = []) {
  if (trail.includes(jobType)) {
    throw new Error(
      `Cyclic ingestion dependency detected: ${[...trail, jobType].join(" -> ")}`,
    );
  }

  const definition = ingestion_job_definitions[jobType];
  const { queuePrefix = "", pipelineSet } = options;
  const childTypes = (definition.dependsOn ?? []).filter((dependency) =>
    pipelineSet.has(dependency),
  );

  const children = childTypes.map((dependency) =>
    buildFlowNode(dependency, options, [...trail, jobType]),
  );

  const node = {
    name: jobType,
    queueName: getQueueName(definition.section, queuePrefix),
    data: {
      type: jobType,
      params: { ...(definition.params ?? {}) },
    },
    // Parent jobs need child return values for paramsFrom fan-out (via job.getChildrenValues()).
    // If children are removed immediately on completion, those values are unavailable.
    opts: { removeOnComplete: false },
  };

  if (children.length > 0) {
    node.children = children;
  }

  return node;
}

export function buildIngestionFlowForest({
  pipelineName = "default",
  queuePrefix = "",
} = {}) {
  const jobTypes = getPipelineJobTypes(pipelineName);
  validatePipelineDefinitions(jobTypes);

  const pipelineSet = new Set(jobTypes);
  const dependencySet = new Set();

  for (const jobType of jobTypes) {
    for (const dependency of ingestion_job_definitions[jobType].dependsOn ?? []) {
      if (pipelineSet.has(dependency)) {
        dependencySet.add(dependency);
      }
    }
  }

  const rootJobTypes = jobTypes.filter((jobType) => !dependencySet.has(jobType));

  return rootJobTypes.map((jobType) =>
    buildFlowNode(jobType, { pipelineSet, queuePrefix }),
  );
}

export function countFlowNodes(flows) {
  const stack = [...flows];
  let count = 0;

  while (stack.length > 0) {
    const node = stack.pop();
    if (!node) continue;
    count += 1;
    if (Array.isArray(node.children)) {
      stack.push(...node.children);
    }
  }

  return count;
}

export function buildSectionJobsMap(pipelineName = "default") {
  const grouped = {};

  for (const jobType of getPipelineJobTypes(pipelineName)) {
    const definition = ingestion_job_definitions[jobType];
    const jobs = grouped[definition.section] ?? [];
    jobs.push(jobType);
    grouped[definition.section] = jobs;
  }

  return grouped;
}

export const section_jobs = buildSectionJobsMap("default");
