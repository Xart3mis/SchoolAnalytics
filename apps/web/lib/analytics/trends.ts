import { Prisma } from "@school-analytics/db/client";

import { mypCriteriaTotalSql, mypFinalGradeSql } from "@/lib/analytics/sql";
import { prisma } from "@/lib/prisma";

export type TermTrendPoint = {
  termId: string;
  label: string;
  value: number;
};

export type AssignmentTrendPoint = {
  id: string;
  label: string;
  fullLabel: string;
  value: number | null;
  kind: "assignment" | "term" | "start";
  subjectId?: string;
  subjectName?: string;
};

export type SubjectTrendSeries = {
  subjectId: string;
  subjectName: string;
  points: TermTrendPoint[];
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
  avgGrade: number;
  subjectId: string;
  subjectName: string;
};

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
    value: null,
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
        value: Number(assignment.avgGrade),
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
      value: null,
      kind: "term",
    });
  }

  return points;
}

export async function getStudentAssignmentTrend(studentId: string, academicYearId: string) {
  const terms = await getTerms(academicYearId);
  if (terms.length === 0) return [];
  const totalExpression = mypCriteriaTotalSql();
  const finalGradeExpression = mypFinalGradeSql(totalExpression);
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
           ${finalGradeExpression}::int AS "avgGrade"
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
  const totalExpression = mypCriteriaTotalSql();
  const finalGradeExpression = mypFinalGradeSql(totalExpression);
  const rows = await prisma.$queryRaw<AssignmentRow[]>(Prisma.sql`
    WITH assignment_grades AS (
      SELECT ge."studentId",
             a."id" AS "assignmentId",
             a."title" AS "assignmentTitle",
             a."dueDate" AS "dueDate",
             a."createdAt" AS "createdAt",
             t."id" AS "termId",
             t."name" AS "termName",
             t."startDate" AS "termStartDate",
             cs."courseId" AS "subjectId",
             ${finalGradeExpression}::int AS "finalGrade"
      FROM "GradeEntry" ge
      JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      JOIN "AcademicTerm" t ON t."id" = cs."academicTermId"
      WHERE cs."id" = ${classSectionId}
        AND t."academicYearId" = ${academicYearId}
      GROUP BY ge."studentId", a."id", a."title", a."dueDate", a."createdAt", t."id", t."name", t."startDate", cs."courseId"
    )
    SELECT ag."assignmentId",
           ag."assignmentTitle",
           ag."dueDate",
           ag."createdAt",
           ag."termId",
           ag."termName",
           ag."termStartDate",
           ag."subjectId",
           c."name" AS "subjectName",
           AVG(ag."finalGrade")::float AS "avgGrade"
    FROM assignment_grades ag
    JOIN "Course" c ON c."id" = ag."subjectId"
    GROUP BY ag."assignmentId",
             ag."assignmentTitle",
             ag."dueDate",
             ag."createdAt",
             ag."termId",
             ag."termName",
             ag."termStartDate",
             ag."subjectId",
             c."name"
    ORDER BY ag."termStartDate" ASC, ag."dueDate" ASC NULLS LAST, ag."createdAt" ASC
  `);

  return buildAssignmentTrend(rows, terms);
}

export async function getGradeAssignmentTrend(gradeLevel: number, academicYearId: string) {
  const terms = await getTerms(academicYearId);
  if (terms.length === 0) return [];
  const totalExpression = mypCriteriaTotalSql();
  const finalGradeExpression = mypFinalGradeSql(totalExpression);
  const rows = await prisma.$queryRaw<AssignmentRow[]>(Prisma.sql`
    WITH assignment_grades AS (
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
             ${finalGradeExpression}::int AS "finalGrade"
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
           AVG("finalGrade")::float AS "avgGrade"
    FROM assignment_grades
    GROUP BY "assignmentId", "assignmentTitle", "dueDate", "createdAt", "termId", "termName", "termStartDate", "subjectId", "subjectName"
    ORDER BY "termStartDate" ASC, "dueDate" ASC NULLS LAST, "createdAt" ASC
  `);

  return buildAssignmentTrend(rows, terms);
}

export async function getStudentSubjectTrends(studentId: string, academicYearId: string) {
  const terms = await getTerms(academicYearId);
  if (terms.length === 0) return [];
  const totalExpression = mypCriteriaTotalSql();
  const finalGradeExpression = mypFinalGradeSql(totalExpression);
  const rows = await prisma.$queryRaw<
    Array<{ termId: string; subjectId: string; subjectName: string; avgGrade: number }>
  >(Prisma.sql`
    WITH final_grades AS (
      SELECT ge."studentId",
             cs."academicTermId" AS "termId",
             cs."courseId" AS "courseId",
             ${finalGradeExpression}::int AS "finalGrade"
      FROM "GradeEntry" ge
      JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      WHERE ge."studentId" = ${studentId}
        AND cs."academicTermId" IN (${Prisma.join(terms.map((t) => t.id))})
      GROUP BY ge."studentId", cs."academicTermId", cs."courseId"
    )
    SELECT final_grades."termId" AS "termId",
           c."id" AS "subjectId",
           c."name" AS "subjectName",
           AVG(final_grades."finalGrade")::float AS "avgGrade"
    FROM final_grades
    JOIN "Course" c ON c."id" = final_grades."courseId"
    GROUP BY final_grades."termId", c."id"
    ORDER BY c."name" ASC
  `);

  return buildSubjectSeries(rows, terms);
}

export async function getClassSubjectTrends(courseId: string, academicYearId: string) {
  const terms = await getTerms(academicYearId);
  if (terms.length === 0) return [];
  const totalExpression = mypCriteriaTotalSql();
  const finalGradeExpression = mypFinalGradeSql(totalExpression);
  const rows = await prisma.$queryRaw<
    Array<{ termId: string; subjectId: string; subjectName: string; avgGrade: number }>
  >(Prisma.sql`
    WITH final_grades AS (
      SELECT ge."studentId",
             cs."academicTermId" AS "termId",
             cs."courseId" AS "courseId",
             ${finalGradeExpression}::int AS "finalGrade"
      FROM "GradeEntry" ge
      JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      WHERE cs."courseId" = ${courseId}
        AND cs."academicTermId" IN (${Prisma.join(terms.map((t) => t.id))})
      GROUP BY ge."studentId", cs."academicTermId", cs."courseId"
    )
    SELECT final_grades."termId" AS "termId",
           c."id" AS "subjectId",
           c."name" AS "subjectName",
           AVG(final_grades."finalGrade")::float AS "avgGrade"
    FROM final_grades
    JOIN "Course" c ON c."id" = final_grades."courseId"
    GROUP BY final_grades."termId", c."id"
    ORDER BY c."name" ASC
  `);

  return buildSubjectSeries(rows, terms);
}

export async function getGradeSubjectTrends(gradeLevel: number, academicYearId: string) {
  const terms = await getTerms(academicYearId);
  if (terms.length === 0) return [];
  const totalExpression = mypCriteriaTotalSql();
  const finalGradeExpression = mypFinalGradeSql(totalExpression);
  const rows = await prisma.$queryRaw<
    Array<{ termId: string; subjectId: string; subjectName: string; avgGrade: number }>
  >(Prisma.sql`
    WITH final_grades AS (
      SELECT ge."studentId",
             cs."academicTermId" AS "termId",
             cs."courseId" AS "courseId",
             ${finalGradeExpression}::int AS "finalGrade"
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
    SELECT final_grades."termId" AS "termId",
           c."id" AS "subjectId",
           c."name" AS "subjectName",
           AVG(final_grades."finalGrade")::float AS "avgGrade"
    FROM final_grades
    JOIN "Course" c ON c."id" = final_grades."courseId"
    GROUP BY final_grades."termId", c."id"
    ORDER BY c."name" ASC
  `);

  return buildSubjectSeries(rows, terms);
}

function buildSubjectSeries(
  rows: Array<{ termId: string; subjectId: string; subjectName: string; avgGrade: number }>,
  terms: Array<{ id: string; name: string }>
): SubjectTrendSeries[] {
  const termIndex = new Map(terms.map((term) => [term.id, term]));
  const grouped = new Map<string, SubjectTrendSeries>();

  for (const row of rows) {
    const existing = grouped.get(row.subjectId);
    const point = {
      termId: row.termId,
      label: formatTermLabel(termIndex.get(row.termId)?.name ?? row.termId),
      value: Number(row.avgGrade),
    };

    if (existing) {
      existing.points.push(point);
    } else {
      grouped.set(row.subjectId, {
        subjectId: row.subjectId,
        subjectName: row.subjectName,
        points: [point],
      });
    }
  }

  return Array.from(grouped.values()).map((series) => ({
    ...series,
    points: terms.map((term) => {
      const found = series.points.find((point) => point.termId === term.id);
      return (
        found ?? {
          termId: term.id,
          label: formatTermLabel(term.name),
          value: 0,
        }
      );
    }),
  }));
}
