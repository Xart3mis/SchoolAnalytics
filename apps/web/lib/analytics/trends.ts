import { Prisma } from "@school-analytics/db/client";

import { prisma } from "@/lib/prisma";

export type CriterionTrendPoint = {
  termId: string;
  label: string;
  criterionA: number;
  criterionB: number;
  criterionC: number;
  criterionD: number;
};

export type AssignmentTrendPoint = {
  id: string;
  label: string;
  fullLabel: string;
  criterionA: number | null;
  criterionB: number | null;
  criterionC: number | null;
  criterionD: number | null;
  kind: "assignment" | "term" | "start";
  subjectId?: string;
  subjectName?: string;
};

async function getTerms(academicYearId: string) {
  return prisma.academicTerm.findMany({
    where: { academicYearId },
    orderBy: { startDate: "asc" },
  });
}

function formatTermLabel(name: string) {
  return name;
}

type AssignmentRow = {
  assignmentId: string;
  assignmentTitle: string | null;
  dueDate: Date | null;
  createdAt: Date;
  termId: string;
  termName: string;
  termStartDate: Date;
  criterionA: number;
  criterionB: number;
  criterionC: number;
  criterionD: number;
  subjectId: string;
  subjectName: string;
};

/**
 * Builds a chronological trend line composed of:
 * 1) a synthetic start marker,
 * 2) assignment points sorted by due/created date within each term,
 * 3) a term boundary marker after each term.
 *
 * This shape allows chart consumers to render assignment progression while
 * preserving explicit term transitions.
 */
function buildAssignmentTrend(
  rows: AssignmentRow[],
  terms: Array<{ id: string; name: string }>
): AssignmentTrendPoint[] {
  if (terms.length === 0) return [];
  const grouped = new Map<string, AssignmentRow[]>();
  for (const row of rows) {
    const bucket = grouped.get(row.termId) ?? [];
    bucket.push(row);
    grouped.set(row.termId, bucket);
  }

  const points: AssignmentTrendPoint[] = [];
  points.push({
    id: `start-${terms[0].id}`,
    label: "0",
    fullLabel: "Start",
    criterionA: null,
    criterionB: null,
    criterionC: null,
    criterionD: null,
    kind: "start",
  });

  let assignmentIndex = 1;
  for (const term of terms) {
    const assignments = (grouped.get(term.id) ?? []).sort((a, b) => {
      const aDate = a.dueDate ?? a.createdAt;
      const bDate = b.dueDate ?? b.createdAt;
      return aDate.getTime() - bDate.getTime();
    });

    for (const assignment of assignments) {
      const fullLabel = assignment.assignmentTitle ?? `Assignment ${assignmentIndex}`;
      const shortLabel =
        assignment.assignmentTitle && assignment.assignmentTitle.length > 12
          ? `${assignment.assignmentTitle.slice(0, 12)}…`
          : assignment.assignmentTitle ?? `A${assignmentIndex}`;
      points.push({
        id: `assignment-${assignment.assignmentId}`,
        label: shortLabel,
        fullLabel,
        criterionA: Number(assignment.criterionA),
        criterionB: Number(assignment.criterionB),
        criterionC: Number(assignment.criterionC),
        criterionD: Number(assignment.criterionD),
        kind: "assignment",
        subjectId: assignment.subjectId,
        subjectName: assignment.subjectName,
      });
      assignmentIndex += 1;
    }

    points.push({
      id: `term-${term.id}`,
      label: formatTermLabel(term.name),
      fullLabel: formatTermLabel(term.name),
      criterionA: null,
      criterionB: null,
      criterionC: null,
      criterionD: null,
      kind: "term",
    });
  }

  return points;
}

export async function getStudentAssignmentTrend(studentId: string, academicYearId: string) {
  const terms = await getTerms(academicYearId);
  if (terms.length === 0) return [];
  const rows = await prisma.$queryRaw<AssignmentRow[]>(Prisma.sql`
    SELECT a."id" AS "assignmentId",
           a."title" AS "assignmentTitle",
           a."dueDate" AS "dueDate",
           a."createdAt" AS "createdAt",
           t."id" AS "termId",
           t."name" AS "termName",
           t."startDate" AS "termStartDate",
           c."id" AS "subjectId",
           c."name" AS "subjectName",
           AVG(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END)::float AS "criterionA",
           AVG(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END)::float AS "criterionB",
           AVG(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END)::float AS "criterionC",
           AVG(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END)::float AS "criterionD"
    FROM "GradeEntry" ge
    JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
    JOIN "Assignment" a ON a."id" = ge."assignmentId"
    JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
    JOIN "Course" c ON c."id" = cs."courseId"
    JOIN "AcademicTerm" t ON t."id" = cs."academicTermId"
    WHERE ge."studentId" = ${studentId}
      AND t."academicYearId" = ${academicYearId}
    GROUP BY a."id", a."title", a."dueDate", a."createdAt", t."id", t."name", t."startDate", c."id", c."name"
    ORDER BY t."startDate" ASC, a."dueDate" ASC NULLS LAST, a."createdAt" ASC
  `);

  return buildAssignmentTrend(rows, terms);
}

export async function getClassAssignmentTrend(classSectionId: string, academicYearId: string) {
  const terms = await getTerms(academicYearId);
  if (terms.length === 0) return [];
  const rows = await prisma.$queryRaw<AssignmentRow[]>(Prisma.sql`
    WITH assignment_scores AS (
      SELECT ge."studentId",
             a."id" AS "assignmentId",
             a."title" AS "assignmentTitle",
             a."dueDate" AS "dueDate",
             a."createdAt" AS "createdAt",
             t."id" AS "termId",
             t."name" AS "termName",
             t."startDate" AS "termStartDate",
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
      WHERE cs."id" = ${classSectionId}
        AND t."academicYearId" = ${academicYearId}
      GROUP BY ge."studentId", a."id", a."title", a."dueDate", a."createdAt", t."id", t."name", t."startDate", cs."courseId"
    )
    SELECT scores."assignmentId",
           scores."assignmentTitle",
           scores."dueDate",
           scores."createdAt",
           scores."termId",
           scores."termName",
           scores."termStartDate",
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
             scores."termId",
             scores."termName",
             scores."termStartDate",
             scores."subjectId",
             c."name"
    ORDER BY scores."termStartDate" ASC, scores."dueDate" ASC NULLS LAST, scores."createdAt" ASC
  `);

  return buildAssignmentTrend(rows, terms);
}

export async function getGradeAssignmentTrend(gradeLevel: number, academicYearId: string) {
  const terms = await getTerms(academicYearId);
  if (terms.length === 0) return [];
  const rows = await prisma.$queryRaw<AssignmentRow[]>(Prisma.sql`
    WITH assignment_scores AS (
      SELECT ge."studentId",
             a."id" AS "assignmentId",
             a."title" AS "assignmentTitle",
             a."dueDate" AS "dueDate",
             a."createdAt" AS "createdAt",
             t."id" AS "termId",
             t."name" AS "termName",
             t."startDate" AS "termStartDate",
             c."id" AS "subjectId",
             c."name" AS "subjectName",
             MAX(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END)::float AS "criterionA",
             MAX(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END)::float AS "criterionB",
             MAX(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END)::float AS "criterionC",
             MAX(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END)::float AS "criterionD"
      FROM "GradeEntry" ge
      JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      JOIN "Course" c ON c."id" = cs."courseId"
      JOIN "GradeLevel" gl ON gl."id" = c."gradeLevelId"
      JOIN "AcademicTerm" t ON t."id" = cs."academicTermId"
      WHERE gl."name" = ${String(gradeLevel)}
        AND t."academicYearId" = ${academicYearId}
      GROUP BY ge."studentId", a."id", a."title", a."dueDate", a."createdAt", t."id", t."name", t."startDate", c."id", c."name"
    )
    SELECT "assignmentId",
           "assignmentTitle",
           "dueDate",
           "createdAt",
           "termId",
           "termName",
           "termStartDate",
           "subjectId",
           "subjectName",
           AVG("criterionA")::float AS "criterionA",
           AVG("criterionB")::float AS "criterionB",
           AVG("criterionC")::float AS "criterionC",
           AVG("criterionD")::float AS "criterionD"
    FROM assignment_scores
    GROUP BY "assignmentId", "assignmentTitle", "dueDate", "createdAt", "termId", "termName", "termStartDate", "subjectId", "subjectName"
    ORDER BY "termStartDate" ASC, "dueDate" ASC NULLS LAST, "createdAt" ASC
  `);

  return buildAssignmentTrend(rows, terms);
}

export async function getStudentSubjectTrends(studentId: string, academicYearId: string) {
  const terms = await getTerms(academicYearId);
  if (terms.length === 0) return [];
  const rows = await prisma.$queryRaw<
    Array<{
      termId: string;
      criterionA: number;
      criterionB: number;
      criterionC: number;
      criterionD: number;
    }>
  >(Prisma.sql`
    WITH student_course AS (
      SELECT ge."studentId",
             cs."academicTermId" AS "termId",
             cs."courseId" AS "courseId",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionA",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionB",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionC",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionD"
      FROM "GradeEntry" ge
      JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      WHERE ge."studentId" = ${studentId}
        AND cs."academicTermId" IN (${Prisma.join(terms.map((t) => t.id))})
      GROUP BY ge."studentId", cs."academicTermId", cs."courseId"
    )
    SELECT "termId",
           AVG("criterionA")::float AS "criterionA",
           AVG("criterionB")::float AS "criterionB",
           AVG("criterionC")::float AS "criterionC",
           AVG("criterionD")::float AS "criterionD"
    FROM student_course
    GROUP BY "termId"
  `);

  return buildCriteriaSeries(rows, terms);
}

export async function getClassSubjectTrends(courseId: string, academicYearId: string) {
  const terms = await getTerms(academicYearId);
  if (terms.length === 0) return [];
  const rows = await prisma.$queryRaw<
    Array<{
      termId: string;
      criterionA: number;
      criterionB: number;
      criterionC: number;
      criterionD: number;
    }>
  >(Prisma.sql`
    WITH student_course AS (
      SELECT ge."studentId",
             cs."academicTermId" AS "termId",
             cs."courseId" AS "courseId",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionA",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionB",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionC",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionD"
      FROM "GradeEntry" ge
      JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      WHERE cs."courseId" = ${courseId}
        AND cs."academicTermId" IN (${Prisma.join(terms.map((t) => t.id))})
      GROUP BY ge."studentId", cs."academicTermId", cs."courseId"
    )
    SELECT "termId",
           AVG("criterionA")::float AS "criterionA",
           AVG("criterionB")::float AS "criterionB",
           AVG("criterionC")::float AS "criterionC",
           AVG("criterionD")::float AS "criterionD"
    FROM student_course
    GROUP BY "termId"
  `);

  return buildCriteriaSeries(rows, terms);
}

export async function getGradeSubjectTrends(gradeLevel: number, academicYearId: string) {
  const terms = await getTerms(academicYearId);
  if (terms.length === 0) return [];
  const rows = await prisma.$queryRaw<
    Array<{
      termId: string;
      criterionA: number;
      criterionB: number;
      criterionC: number;
      criterionD: number;
    }>
  >(Prisma.sql`
    WITH student_course AS (
      SELECT ge."studentId",
             cs."academicTermId" AS "termId",
             cs."courseId" AS "courseId",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionA",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionB",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionC",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionD"
      FROM "GradeEntry" ge
      JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      JOIN "Course" c ON c."id" = cs."courseId"
      JOIN "GradeLevel" gl ON gl."id" = c."gradeLevelId"
      WHERE gl."name" = ${String(gradeLevel)}
        AND cs."academicTermId" IN (${Prisma.join(terms.map((t) => t.id))})
      GROUP BY ge."studentId", cs."academicTermId", cs."courseId"
    )
    SELECT "termId",
           AVG("criterionA")::float AS "criterionA",
           AVG("criterionB")::float AS "criterionB",
           AVG("criterionC")::float AS "criterionC",
           AVG("criterionD")::float AS "criterionD"
    FROM student_course
    GROUP BY "termId"
  `);

  return buildCriteriaSeries(rows, terms);
}

function buildCriteriaSeries(
  rows: Array<{ termId: string; criterionA: number; criterionB: number; criterionC: number; criterionD: number }>,
  terms: Array<{ id: string; name: string }>
): CriterionTrendPoint[] {
  const byTerm = new Map(
    rows.map((row) => [
      row.termId,
      {
        criterionA: Number(row.criterionA),
        criterionB: Number(row.criterionB),
        criterionC: Number(row.criterionC),
        criterionD: Number(row.criterionD),
      },
    ])
  );

  return terms.map((term) => {
    const found = byTerm.get(term.id);
    return {
      termId: term.id,
      label: formatTermLabel(term.name),
      criterionA: found?.criterionA ?? 0,
      criterionB: found?.criterionB ?? 0,
      criterionC: found?.criterionC ?? 0,
      criterionD: found?.criterionD ?? 0,
    };
  });
}
