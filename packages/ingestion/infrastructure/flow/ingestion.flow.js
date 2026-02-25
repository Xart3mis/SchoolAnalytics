export const ingestion_job_definitions = {
  assignments: {
    section: "assignments",
    dependsOn: [],
  },
  // "assignment-by-id": {
  //   section: "assignments",
  //   dependsOn: ["assignments"],
  // },
  "student-assignments": {
    section: "assignments",
    dependsOn: ["assignments", "curriculum", "students"],
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
  },
  "progress-summary": {
    section: "gradebook",
    dependsOn: ["grading-periods"],
  },
  courses: {
    section: "course",
    dependsOn: [],
  },
  "course-students": {
    section: "course",
    dependsOn: ["courses"],
  },
  // students: {
  //   section: "students",
  //   dependsOn: [],
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
  // },
  // "grade-scale": {
  //   section: "term-grades",
  //   dependsOn: [],
  // },
  // "term-grades": {
  //   section: "term-grades",
  //   dependsOn: ["grade-scale", "grading-periods"],
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

  const sharedDependencies = [...dependencyParents.entries()].filter(
    ([, parents]) => parents.length > 1,
  );

  if (sharedDependencies.length > 0) {
    const message = sharedDependencies
      .map(
        ([dependency, parents]) => `${dependency} -> [${parents.join(", ")}]`,
      )
      .join("; ");
    throw new Error(
      `FlowProducer trees do not support shared dependency nodes without duplicating fetches. Resolve shared dependencies first: ${message}`,
    );
  }
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
    data: { type: jobType },
    opts: { removeOnComplete: true },
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
    for (const dependency of ingestion_job_definitions[jobType].dependsOn ??
      []) {
      if (pipelineSet.has(dependency)) {
        dependencySet.add(dependency);
      }
    }
  }

  const rootJobTypes = jobTypes.filter(
    (jobType) => !dependencySet.has(jobType),
  );

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
