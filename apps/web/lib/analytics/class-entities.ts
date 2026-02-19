import { Prisma } from "@school-analytics/db/client";

import type { CriteriaSummary, OverallStat, SubjectStat } from "@/lib/analytics/aggregates";
import { RISK_THRESHOLDS } from "@/lib/analytics/config";
import { prisma } from "@/lib/prisma";
import type { AssignmentTrendPoint, CriterionTrendPoint } from "@/lib/analytics/trends";
import type { AtRiskRow } from "@/lib/analytics/risk";

type TermSection = {
  id: string;
  name: string;
  courseId: string;
  courseName: string;
  academicYearId: string;
  academicYearName: string;
  academicTermId: string | null;
  gradeLevel: number | null;
  rawSourceData: Prisma.JsonValue | null;
};

type GroupingParts = {
  classKey: string;
  classLabel: string;
  gradeLevel: number | null;
};

type ClassEntityGroup = {
  id: string;
  classKey: string;
  classLabel: string;
  gradeLevel: number | null;
  academicYear: string;
  sectionIds: Set<string>;
  sectionNames: Set<string>;
  courseIds: Set<string>;
  courseNames: Set<string>;
};

type ScoreRow = {
  classSectionId: string;
  studentId: string;
  courseId: string;
  criterionA: number;
  criterionB: number;
  criterionC: number;
  criterionD: number;
  averageScore: number;
};

type YearScoreRow = ScoreRow & { termId: string };

type AssignmentRow = {
  assignmentId: string;
  assignmentTitle: string | null;
  dueDate: Date | null;
  createdAt: Date;
  subjectId: string;
  subjectName: string;
  criterionA: number;
  criterionB: number;
  criterionC: number;
  criterionD: number;
};

export type ClassEntityListRow = {
  id: string;
  classKey: string;
  classLabel: string;
  gradeLevel: number | null;
  academicYear: string;
  averageScore: number;
  studentCount: number;
  subjectCount: number;
  riskLevel: "High" | "Medium" | "Low";
};

export type ClassEntityDetail = {
  entity: ClassEntityListRow & {
    sectionIds: string[];
    sectionNames: string[];
    courseIds: string[];
    courseNames: string[];
  };
  overall: OverallStat;
  criteriaSummary: CriteriaSummary;
  subjectStats: SubjectStat[];
  assignmentTrend: AssignmentTrendPoint[];
  criterionTrends: CriterionTrendPoint[];
  atRisk: AtRiskRow[];
};

function riskLevel(score: number): "High" | "Medium" | "Low" {
  if (score <= RISK_THRESHOLDS.high) return "High";
  if (score <= RISK_THRESHOLDS.medium) return "Medium";
  return "Low";
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function parseGradeLevel(raw: string | null | undefined) {
  if (!raw) return null;
  const match = raw.match(/\d+/);
  if (!match) return null;
  const value = Number(match[0]);
  return Number.isFinite(value) ? value : null;
}

function normalizeClassKey(input: string) {
  return input.trim().replace(/\s+/g, " ").toUpperCase();
}

function coerceRecord(input: Prisma.JsonValue | null | undefined): Record<string, unknown> | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  return input as Record<string, unknown>;
}

function readStringFromRecord(record: Record<string, unknown> | null, keys: string[]) {
  if (!record) return null;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) return value.trim();
  }
  return null;
}

function extractMypCohortToken(input: string): { classKey: string; classLabel: string; gradeLevel: number } | null {
  const normalized = input.trim().replace(/\s+/g, " ");
  const mypMatch = normalized.match(/\bMYP\s*[-_\s]*([1-5])\s*[-_\s]*([A-Z])\b/i);
  if (!mypMatch?.[1] || !mypMatch[2]) return null;
  const gradeLevel = Number(mypMatch[1]);
  if (!Number.isFinite(gradeLevel)) return null;
  const sectionToken = mypMatch[2].toUpperCase();
  const classKey = `MYP${gradeLevel}${sectionToken}`;
  return {
    classKey,
    classLabel: `MYP ${gradeLevel}${sectionToken}`,
    gradeLevel,
  };
}

function extractClassGroupingParts(
  sectionName: string,
  options?: { gradeLevel?: number | null; rawSourceData?: Prisma.JsonValue | null }
): GroupingParts {
  const normalized = sectionName.trim().replace(/\s+/g, " ");
  const raw = coerceRecord(options?.rawSourceData);
  const sourceName =
    readStringFromRecord(raw, ["className", "class_name", "sectionName", "section_name"]) ?? normalized;

  const mypGrouping = extractMypCohortToken(sourceName) ?? extractMypCohortToken(normalized);
  if (mypGrouping) {
    return mypGrouping;
  }

  const classMatch = normalized.match(/\b(?:class|section)\s*([A-Za-z0-9]{1,6})\b/i);
  if (classMatch?.[1]) {
    const token = normalizeClassKey(classMatch[1]);
    return { classKey: token, classLabel: `Class ${token}`, gradeLevel: options?.gradeLevel ?? null };
  }

  const fallbackKey = normalizeClassKey(normalized);
  return { classKey: fallbackKey, classLabel: normalized, gradeLevel: options?.gradeLevel ?? null };
}

export function createClassEntityId(gradeLevel: number | null, classKey: string) {
  const normalizedGrade = Number.isFinite(gradeLevel ?? NaN) ? String(gradeLevel) : "NA";
  return `g${normalizedGrade}:${encodeURIComponent(classKey)}`;
}

export function parseClassEntityId(id: string): { gradeLevel: number | null; classKey: string } | null {
  const match = id.match(/^g([^:]+):(.+)$/);
  if (!match) return null;
  const gradeToken = match[1] ?? "";
  const decodedKey = decodeURIComponent(match[2] ?? "").trim();
  if (!decodedKey) return null;
  if (gradeToken === "NA") {
    return { gradeLevel: null, classKey: decodedKey };
  }
  const gradeLevel = Number(gradeToken);
  if (!Number.isFinite(gradeLevel)) return null;
  return { gradeLevel, classKey: decodedKey };
}

function isUuidLike(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function loadTermSections(termId: string): Promise<TermSection[]> {
  const sections = await prisma.classSection.findMany({
    where: { academicTermId: termId },
    include: {
      academicYear: true,
      course: {
        include: {
          gradeLevel: true,
        },
      },
    },
  });

  return sections.map((section) => ({
    id: section.id,
    name: section.name,
    courseId: section.courseId,
    courseName: section.course.name,
    academicYearId: section.academicYearId,
    academicYearName: section.academicYear.name,
    academicTermId: section.academicTermId,
    gradeLevel: parseGradeLevel(section.course.gradeLevel?.name),
    rawSourceData: section.rawSourceData,
  }));
}

function buildGroups(sections: TermSection[]) {
  const groups = new Map<string, ClassEntityGroup>();

  for (const section of sections) {
    const grouping = extractClassGroupingParts(section.name, {
      gradeLevel: section.gradeLevel,
      rawSourceData: section.rawSourceData,
    });
    const resolvedGradeLevel = section.gradeLevel ?? grouping.gradeLevel;
    const entityId = createClassEntityId(resolvedGradeLevel, grouping.classKey);
    const existing = groups.get(entityId);
    if (existing) {
      existing.sectionIds.add(section.id);
      existing.sectionNames.add(section.name);
      existing.courseIds.add(section.courseId);
      existing.courseNames.add(section.courseName);
      continue;
    }
    groups.set(entityId, {
      id: entityId,
      classKey: grouping.classKey,
      classLabel: grouping.classLabel,
      gradeLevel: resolvedGradeLevel,
      academicYear: section.academicYearName,
      sectionIds: new Set([section.id]),
      sectionNames: new Set([section.name]),
      courseIds: new Set([section.courseId]),
      courseNames: new Set([section.courseName]),
    });
  }

  return groups;
}

async function fetchScores(sectionIds: string[]): Promise<ScoreRow[]> {
  if (sectionIds.length === 0) return [];
  const rows = await prisma.$queryRaw<
    Array<{
      classSectionId: string;
      studentId: string;
      courseId: string;
      criterionA: number;
      criterionB: number;
      criterionC: number;
      criterionD: number;
      averageScore: number;
    }>
  >(Prisma.sql`
    WITH student_course AS (
      SELECT cs."id" AS "classSectionId",
             ge."studentId",
             cs."courseId" AS "courseId",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionA",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionB",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionC",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionD"
      FROM "GradeEntry" ge
      JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      WHERE cs."id" IN (${Prisma.join(sectionIds)})
      GROUP BY cs."id", ge."studentId", cs."courseId"
    )
    SELECT "classSectionId",
           "studentId",
           "courseId",
           "criterionA",
           "criterionB",
           "criterionC",
           "criterionD",
           (("criterionA" + "criterionB" + "criterionC" + "criterionD") / 4.0)::float AS "averageScore"
    FROM student_course
  `);

  return rows.map((row) => ({
    classSectionId: row.classSectionId,
    studentId: row.studentId,
    courseId: row.courseId,
    criterionA: Number(row.criterionA),
    criterionB: Number(row.criterionB),
    criterionC: Number(row.criterionC),
    criterionD: Number(row.criterionD),
    averageScore: Number(row.averageScore),
  }));
}

async function fetchScoresByYear(sectionIds: string[], academicYearId: string): Promise<YearScoreRow[]> {
  if (sectionIds.length === 0) return [];
  const rows = await prisma.$queryRaw<
    Array<{
      classSectionId: string;
      studentId: string;
      courseId: string;
      termId: string;
      criterionA: number;
      criterionB: number;
      criterionC: number;
      criterionD: number;
      averageScore: number;
    }>
  >(Prisma.sql`
    WITH student_course AS (
      SELECT cs."id" AS "classSectionId",
             ge."studentId",
             cs."courseId" AS "courseId",
             cs."academicTermId" AS "termId",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionA",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionB",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionC",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionD"
      FROM "GradeEntry" ge
      JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      JOIN "AcademicTerm" t ON t."id" = cs."academicTermId"
      WHERE cs."id" IN (${Prisma.join(sectionIds)})
        AND t."academicYearId" = ${academicYearId}
      GROUP BY cs."id", ge."studentId", cs."courseId", cs."academicTermId"
    )
    SELECT "classSectionId",
           "studentId",
           "courseId",
           "termId",
           "criterionA",
           "criterionB",
           "criterionC",
           "criterionD",
           (("criterionA" + "criterionB" + "criterionC" + "criterionD") / 4.0)::float AS "averageScore"
    FROM student_course
  `);

  return rows.map((row) => ({
    classSectionId: row.classSectionId,
    studentId: row.studentId,
    courseId: row.courseId,
    termId: row.termId,
    criterionA: Number(row.criterionA),
    criterionB: Number(row.criterionB),
    criterionC: Number(row.criterionC),
    criterionD: Number(row.criterionD),
    averageScore: Number(row.averageScore),
  }));
}

async function fetchAssessmentCounts(sectionIds: string[]) {
  if (sectionIds.length === 0) return new Map<string, number>();
  const rows = await prisma.$queryRaw<Array<{ courseId: string; assessmentCount: number }>>(Prisma.sql`
    SELECT cs."courseId" AS "courseId",
           COUNT(ge."id")::int AS "assessmentCount"
    FROM "GradeEntry" ge
    JOIN "Assignment" a ON a."id" = ge."assignmentId"
    JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
    WHERE cs."id" IN (${Prisma.join(sectionIds)})
    GROUP BY cs."courseId"
  `);
  return new Map(rows.map((row) => [row.courseId, Number(row.assessmentCount)]));
}

function shortAssignmentLabel(title: string | null, fallback: number) {
  if (!title) return `A${fallback}`;
  return title.length > 12 ? `${title.slice(0, 12)}...` : title;
}

async function fetchAssignmentRows(sectionIds: string[], academicYearId: string): Promise<AssignmentRow[]> {
  if (sectionIds.length === 0) return [];
  const rows = await prisma.$queryRaw<
    Array<{
      assignmentId: string;
      assignmentTitle: string | null;
      dueDate: Date | null;
      createdAt: Date;
      subjectId: string;
      subjectName: string;
      criterionA: number;
      criterionB: number;
      criterionC: number;
      criterionD: number;
    }>
  >(Prisma.sql`
    WITH assignment_scores AS (
      SELECT ge."studentId",
             a."id" AS "assignmentId",
             a."title" AS "assignmentTitle",
             a."dueDate" AS "dueDate",
             a."createdAt" AS "createdAt",
             cs."courseId" AS "subjectId",
             MAX(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END)::float AS "criterionA",
             MAX(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END)::float AS "criterionB",
             MAX(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END)::float AS "criterionC",
             MAX(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END)::float AS "criterionD"
      FROM "GradeEntry" ge
      JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      JOIN "AcademicTerm" t ON t."id" = cs."academicTermId"
      WHERE cs."id" IN (${Prisma.join(sectionIds)})
        AND t."academicYearId" = ${academicYearId}
      GROUP BY ge."studentId", a."id", a."title", a."dueDate", a."createdAt", cs."courseId"
    )
    SELECT scores."assignmentId",
           scores."assignmentTitle",
           scores."dueDate",
           scores."createdAt",
           scores."subjectId",
           c."name" AS "subjectName",
           AVG(scores."criterionA")::float AS "criterionA",
           AVG(scores."criterionB")::float AS "criterionB",
           AVG(scores."criterionC")::float AS "criterionC",
           AVG(scores."criterionD")::float AS "criterionD"
    FROM assignment_scores scores
    JOIN "Course" c ON c."id" = scores."subjectId"
    GROUP BY scores."assignmentId",
             scores."assignmentTitle",
             scores."dueDate",
             scores."createdAt",
             scores."subjectId",
             c."name"
    ORDER BY scores."dueDate" ASC NULLS LAST, scores."createdAt" ASC
  `);

  return rows.map((row) => ({
    assignmentId: row.assignmentId,
    assignmentTitle: row.assignmentTitle,
    dueDate: row.dueDate,
    createdAt: row.createdAt,
    subjectId: row.subjectId,
    subjectName: row.subjectName,
    criterionA: Number(row.criterionA),
    criterionB: Number(row.criterionB),
    criterionC: Number(row.criterionC),
    criterionD: Number(row.criterionD),
  }));
}

function buildStudentAverages(rows: ScoreRow[]) {
  const perStudent = new Map<string, number[]>();
  for (const row of rows) {
    const bucket = perStudent.get(row.studentId) ?? [];
    bucket.push(row.averageScore);
    perStudent.set(row.studentId, bucket);
  }
  const studentAverages = new Map<string, number>();
  for (const [studentId, scores] of perStudent.entries()) {
    studentAverages.set(studentId, average(scores));
  }
  return studentAverages;
}

async function resolveRouteToEntityId(routeId: string, termId: string) {
  const parsed = parseClassEntityId(routeId);
  if (parsed) return routeId;

  if (!isUuidLike(routeId)) return null;

  const section = await prisma.classSection.findUnique({
    where: { id: routeId },
    include: { course: { include: { gradeLevel: true } } },
  });
  if (!section || section.academicTermId !== termId) return null;

  const gradeLevel = parseGradeLevel(section.course.gradeLevel?.name);
  const grouping = extractClassGroupingParts(section.name, {
    gradeLevel,
    rawSourceData: section.rawSourceData,
  });
  return createClassEntityId(gradeLevel ?? grouping.gradeLevel, grouping.classKey);
}

export async function getClassEntityList(
  termId: string,
  options?: { query?: string; gradeLevel?: number }
): Promise<ClassEntityListRow[]> {
  const sections = await loadTermSections(termId);
  if (sections.length === 0) return [];

  const groups = buildGroups(sections);
  const sectionIds = sections.map((section) => section.id);
  const [scores, enrollments] = await Promise.all([
    fetchScores(sectionIds),
    prisma.enrollment.findMany({
      where: {
        classSectionId: { in: sectionIds },
        role: "STUDENT",
      },
      select: {
        classSectionId: true,
        studentId: true,
      },
    }),
  ]);

  const sectionToGroupId = new Map<string, string>();
  for (const group of groups.values()) {
    for (const sectionId of group.sectionIds) {
      sectionToGroupId.set(sectionId, group.id);
    }
  }

  const groupScoreRows = new Map<string, ScoreRow[]>();
  for (const row of scores) {
    const groupId = sectionToGroupId.get(row.classSectionId);
    if (!groupId) continue;
    const bucket = groupScoreRows.get(groupId) ?? [];
    bucket.push(row);
    groupScoreRows.set(groupId, bucket);
  }

  const groupStudents = new Map<string, Set<string>>();
  for (const enrollment of enrollments) {
    if (!enrollment.studentId) continue;
    const groupId = sectionToGroupId.get(enrollment.classSectionId);
    if (!groupId) continue;
    const bucket = groupStudents.get(groupId) ?? new Set<string>();
    bucket.add(enrollment.studentId);
    groupStudents.set(groupId, bucket);
  }

  let rows = Array.from(groups.values()).map((group) => {
    const groupRows = groupScoreRows.get(group.id) ?? [];
    const studentAverages = Array.from(buildStudentAverages(groupRows).values());
    const classAverage = average(studentAverages);
    return {
      id: group.id,
      classKey: group.classKey,
      classLabel: group.classLabel,
      gradeLevel: group.gradeLevel,
      academicYear: group.academicYear,
      averageScore: classAverage,
      studentCount: (groupStudents.get(group.id) ?? new Set()).size,
      subjectCount: group.courseIds.size,
      riskLevel: riskLevel(classAverage),
      sectionNames: Array.from(group.sectionNames),
      courseNames: Array.from(group.courseNames),
    };
  });

  if (typeof options?.gradeLevel === "number") {
    rows = rows.filter((row) => row.gradeLevel === options.gradeLevel);
  }

  const search = options?.query?.trim().toLowerCase();
  if (search) {
    rows = rows.filter((row) => {
      const searchable = [
        row.classLabel,
        row.classKey,
        ...(row.sectionNames ?? []),
        ...(row.courseNames ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return searchable.includes(search);
    });
  }

  return rows
    .sort((a, b) => {
      const gradeDiff = (a.gradeLevel ?? Number.MAX_SAFE_INTEGER) - (b.gradeLevel ?? Number.MAX_SAFE_INTEGER);
      if (gradeDiff !== 0) return gradeDiff;
      return a.classLabel.localeCompare(b.classLabel);
    })
    .map(({ sectionNames: _sectionNames, courseNames: _courseNames, ...row }) => row);
}

export async function getClassEntityDetail(args: {
  routeId: string;
  termId: string;
  academicYearId: string;
  atRiskLimit?: number;
}): Promise<ClassEntityDetail | null> {
  const atRiskLimit = args.atRiskLimit ?? 15;
  const entityId = await resolveRouteToEntityId(args.routeId, args.termId);
  if (!entityId) return null;

  const entityParts = parseClassEntityId(entityId);
  if (!entityParts) return null;

  const [termSections, allYearSections, terms] = await Promise.all([
    loadTermSections(args.termId),
    prisma.classSection.findMany({
      where: { academicYearId: args.academicYearId },
      include: {
        course: { include: { gradeLevel: true } },
        academicTerm: true,
      },
    }),
    prisma.academicTerm.findMany({
      where: { academicYearId: args.academicYearId },
      orderBy: { startDate: "asc" },
    }),
  ]);

  const currentSections = termSections.filter((section) => {
    const parts = extractClassGroupingParts(section.name, {
      gradeLevel: section.gradeLevel,
      rawSourceData: section.rawSourceData,
    });
    const resolvedGradeLevel = section.gradeLevel ?? parts.gradeLevel;
    return parts.classKey === entityParts.classKey && resolvedGradeLevel === entityParts.gradeLevel;
  });
  if (currentSections.length === 0) return null;

  const group = buildGroups(currentSections).get(entityId);
  if (!group) return null;

  const matchingYearSections = allYearSections.filter((section) => {
    const grade = parseGradeLevel(section.course.gradeLevel?.name);
    const parts = extractClassGroupingParts(section.name, {
      gradeLevel: grade,
      rawSourceData: section.rawSourceData,
    });
    const resolvedGradeLevel = grade ?? parts.gradeLevel;
    return parts.classKey === entityParts.classKey && resolvedGradeLevel === entityParts.gradeLevel;
  });

  const currentSectionIds = Array.from(group.sectionIds);
  const yearSectionIds = matchingYearSections.map((section) => section.id);

  const [currentScores, yearScores, assessmentCounts, enrollments, assignmentRows] = await Promise.all([
    fetchScores(currentSectionIds),
    fetchScoresByYear(yearSectionIds, args.academicYearId),
    fetchAssessmentCounts(currentSectionIds),
    prisma.enrollment.findMany({
      where: {
        classSectionId: { in: currentSectionIds },
        role: "STUDENT",
      },
      select: { studentId: true },
    }),
    fetchAssignmentRows(currentSectionIds, args.academicYearId),
  ]);

  const studentAverages = buildStudentAverages(currentScores);
  const averageScore = average(Array.from(studentAverages.values()));
  const criteriaSummary: CriteriaSummary = {
    criterionA: average(currentScores.map((row) => row.criterionA)),
    criterionB: average(currentScores.map((row) => row.criterionB)),
    criterionC: average(currentScores.map((row) => row.criterionC)),
    criterionD: average(currentScores.map((row) => row.criterionD)),
  };
  const overall: OverallStat = {
    averageScore,
    riskLevel: riskLevel(averageScore),
  };

  const courseStats = new Map<
    string,
    {
      subjectName: string;
      criterionA: number[];
      criterionB: number[];
      criterionC: number[];
      criterionD: number[];
      avg: number[];
    }
  >();
  for (const row of currentScores) {
    const course = currentSections.find((section) => section.courseId === row.courseId);
    const subjectName = course?.courseName ?? "Unknown subject";
    const bucket = courseStats.get(row.courseId) ?? {
      subjectName,
      criterionA: [],
      criterionB: [],
      criterionC: [],
      criterionD: [],
      avg: [],
    };
    bucket.criterionA.push(row.criterionA);
    bucket.criterionB.push(row.criterionB);
    bucket.criterionC.push(row.criterionC);
    bucket.criterionD.push(row.criterionD);
    bucket.avg.push(row.averageScore);
    courseStats.set(row.courseId, bucket);
  }

  const subjectStats: SubjectStat[] = Array.from(courseStats.entries())
    .map(([subjectId, stats]) => ({
      subjectId,
      subjectName: stats.subjectName,
      averageScore: average(stats.avg),
      assessmentCount: assessmentCounts.get(subjectId) ?? 0,
      criterionA: average(stats.criterionA),
      criterionB: average(stats.criterionB),
      criterionC: average(stats.criterionC),
      criterionD: average(stats.criterionD),
    }))
    .sort((a, b) => a.subjectName.localeCompare(b.subjectName));

  const termsById = new Map(terms.map((term) => [term.id, term]));
  const yearRowsByTerm = new Map<string, YearScoreRow[]>();
  for (const row of yearScores) {
    const bucket = yearRowsByTerm.get(row.termId) ?? [];
    bucket.push(row);
    yearRowsByTerm.set(row.termId, bucket);
  }
  const criterionTrends: CriterionTrendPoint[] = terms.map((term) => {
    const rows = yearRowsByTerm.get(term.id) ?? [];
    return {
      termId: term.id,
      label: term.name,
      criterionA: average(rows.map((row) => row.criterionA)),
      criterionB: average(rows.map((row) => row.criterionB)),
      criterionC: average(rows.map((row) => row.criterionC)),
      criterionD: average(rows.map((row) => row.criterionD)),
    };
  });

  const currentTermIndex = terms.findIndex((term) => term.id === args.termId);
  const previousTerm = currentTermIndex > 0 ? terms[currentTermIndex - 1] : null;
  const currentTerm = termsById.get(args.termId);
  const assignmentTrend: AssignmentTrendPoint[] = [
    {
      id: `start-${args.termId}`,
      label: previousTerm?.name ?? "Start",
      fullLabel: previousTerm?.name ?? "Start",
      criterionA: null,
      criterionB: null,
      criterionC: null,
      criterionD: null,
      kind: "start",
    },
  ];
  assignmentRows
    .sort((a, b) => {
      const aDate = a.dueDate ?? a.createdAt;
      const bDate = b.dueDate ?? b.createdAt;
      return aDate.getTime() - bDate.getTime();
    })
    .forEach((row, index) => {
      assignmentTrend.push({
        id: `assignment-${row.assignmentId}`,
        label: shortAssignmentLabel(row.assignmentTitle, index + 1),
        fullLabel: row.assignmentTitle ?? `Assignment ${index + 1}`,
        criterionA: row.criterionA,
        criterionB: row.criterionB,
        criterionC: row.criterionC,
        criterionD: row.criterionD,
        kind: "assignment",
        subjectId: row.subjectId,
        subjectName: row.subjectName,
        termId: args.termId,
        termName: currentTerm?.name ?? undefined,
        eventDate: (row.dueDate ?? row.createdAt).toISOString(),
      });
    });
  if (currentTerm) {
    assignmentTrend.push({
      id: `term-${currentTerm.id}`,
      label: currentTerm.name,
      fullLabel: currentTerm.name,
      criterionA: null,
      criterionB: null,
      criterionC: null,
      criterionD: null,
      kind: "term",
    });
  }

  const studentIds = Array.from(studentAverages.keys());
  const studentProfiles = studentIds.length
    ? await prisma.student.findMany({
        where: { id: { in: studentIds } },
        include: { user: true },
      })
    : [];
  const studentsById = new Map(
    studentProfiles.map((student) => [
      student.id,
      {
        fullName:
          [student.firstName, student.lastName].filter(Boolean).join(" ").trim() ||
          student.user.displayName ||
          student.user.email,
      },
    ])
  );
  const atRisk: AtRiskRow[] = Array.from(studentAverages.entries())
    .map(([studentId, studentAverage]) => ({
      id: studentId,
      fullName: studentsById.get(studentId)?.fullName ?? "Unknown Student",
      gradeLevel: entityParts.gradeLevel ?? 0,
      averageScore: studentAverage,
      riskLevel: riskLevel(studentAverage),
    }))
    .sort((a, b) => a.averageScore - b.averageScore)
    .slice(0, atRiskLimit);

  return {
    entity: {
      id: group.id,
      classKey: group.classKey,
      classLabel: group.classLabel,
      gradeLevel: group.gradeLevel,
      academicYear: group.academicYear,
      averageScore,
      studentCount: new Set(enrollments.map((row) => row.studentId).filter(Boolean)).size,
      subjectCount: group.courseIds.size,
      riskLevel: riskLevel(averageScore),
      sectionIds: Array.from(group.sectionIds),
      sectionNames: Array.from(group.sectionNames),
      courseIds: Array.from(group.courseIds),
      courseNames: Array.from(group.courseNames),
    },
    overall,
    criteriaSummary,
    subjectStats,
    assignmentTrend,
    criterionTrends,
    atRisk,
  };
}
