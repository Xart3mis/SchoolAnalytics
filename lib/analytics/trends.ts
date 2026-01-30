import { Prisma } from "@prisma/client";

import { weightedScoreSql } from "@/lib/analytics/sql";
import { prisma } from "@/lib/prisma";

export type TermTrendPoint = {
  termId: string;
  label: string;
  value: number;
};

export type SubjectTrendSeries = {
  subjectId: string;
  subjectName: string;
  points: TermTrendPoint[];
};

async function getTerms(academicYear: string) {
  return prisma.term.findMany({
    where: { academicYear },
    orderBy: { trimester: "asc" },
  });
}

function formatTermLabel(trimester: string) {
  return trimester;
}

export async function getStudentTermTrend(studentId: string, academicYear: string) {
  const terms = await getTerms(academicYear);
  if (terms.length === 0) return [];
  const scoreExpression = weightedScoreSql();
  const rows = await prisma.$queryRaw<
    Array<{ termId: string; avgScore: number }>
  >(Prisma.sql`
    SELECT "termId", AVG(${scoreExpression})::float AS "avgScore"
    FROM "StudentSubjectTermScore"
    WHERE "studentId" = ${studentId}
      AND "termId" IN (${Prisma.join(terms.map((t) => t.id))})
    GROUP BY "termId"
  `);

  const map = new Map(rows.map((row) => [row.termId, Number(row.avgScore)]));
  return terms.map((term) => ({
    termId: term.id,
    label: formatTermLabel(term.trimester),
    value: map.get(term.id) ?? 0,
  }));
}

export async function getClassTermTrend(classId: string, academicYear: string) {
  const terms = await getTerms(academicYear);
  if (terms.length === 0) return [];
  const scoreExpression = weightedScoreSql();
  const rows = await prisma.$queryRaw<
    Array<{ termId: string; avgScore: number }>
  >(Prisma.sql`
    SELECT "termId", AVG(${scoreExpression})::float AS "avgScore"
    FROM "StudentSubjectTermScore"
    WHERE "classId" = ${classId}
      AND "termId" IN (${Prisma.join(terms.map((t) => t.id))})
    GROUP BY "termId"
  `);

  const map = new Map(rows.map((row) => [row.termId, Number(row.avgScore)]));
  return terms.map((term) => ({
    termId: term.id,
    label: formatTermLabel(term.trimester),
    value: map.get(term.id) ?? 0,
  }));
}

export async function getGradeTermTrend(gradeLevel: number, academicYear: string) {
  const terms = await getTerms(academicYear);
  if (terms.length === 0) return [];
  const scoreExpression = weightedScoreSql();
  const rows = await prisma.$queryRaw<
    Array<{ termId: string; avgScore: number }>
  >(Prisma.sql`
    SELECT st."termId", AVG(${scoreExpression})::float AS "avgScore"
    FROM "StudentSubjectTermScore" st
    JOIN "Student" s ON s."id" = st."studentId"
    WHERE s."gradeLevel" = ${gradeLevel}
      AND st."termId" IN (${Prisma.join(terms.map((t) => t.id))})
    GROUP BY st."termId"
  `);

  const map = new Map(rows.map((row) => [row.termId, Number(row.avgScore)]));
  return terms.map((term) => ({
    termId: term.id,
    label: formatTermLabel(term.trimester),
    value: map.get(term.id) ?? 0,
  }));
}

export async function getStudentSubjectTrends(studentId: string, academicYear: string) {
  const terms = await getTerms(academicYear);
  if (terms.length === 0) return [];
  const scoreExpression = weightedScoreSql();
  const rows = await prisma.$queryRaw<
    Array<{ termId: string; subjectId: string; subjectName: string; avgScore: number }>
  >(Prisma.sql`
    SELECT st."termId",
           sub."id" AS "subjectId",
           sub."name" AS "subjectName",
           AVG(${scoreExpression})::float AS "avgScore"
    FROM "StudentSubjectTermScore" st
    JOIN "Subject" sub ON sub."id" = st."subjectId"
    WHERE st."studentId" = ${studentId}
      AND st."termId" IN (${Prisma.join(terms.map((t) => t.id))})
    GROUP BY st."termId", sub."id"
    ORDER BY sub."name" ASC
  `);

  return buildSubjectSeries(rows, terms);
}

export async function getClassSubjectTrends(classId: string, academicYear: string) {
  const terms = await getTerms(academicYear);
  if (terms.length === 0) return [];
  const scoreExpression = weightedScoreSql();
  const rows = await prisma.$queryRaw<
    Array<{ termId: string; subjectId: string; subjectName: string; avgScore: number }>
  >(Prisma.sql`
    SELECT st."termId",
           sub."id" AS "subjectId",
           sub."name" AS "subjectName",
           AVG(${scoreExpression})::float AS "avgScore"
    FROM "StudentSubjectTermScore" st
    JOIN "Subject" sub ON sub."id" = st."subjectId"
    WHERE st."classId" = ${classId}
      AND st."termId" IN (${Prisma.join(terms.map((t) => t.id))})
    GROUP BY st."termId", sub."id"
    ORDER BY sub."name" ASC
  `);

  return buildSubjectSeries(rows, terms);
}

export async function getGradeSubjectTrends(gradeLevel: number, academicYear: string) {
  const terms = await getTerms(academicYear);
  if (terms.length === 0) return [];
  const scoreExpression = weightedScoreSql();
  const rows = await prisma.$queryRaw<
    Array<{ termId: string; subjectId: string; subjectName: string; avgScore: number }>
  >(Prisma.sql`
    SELECT st."termId",
           sub."id" AS "subjectId",
           sub."name" AS "subjectName",
           AVG(${scoreExpression})::float AS "avgScore"
    FROM "StudentSubjectTermScore" st
    JOIN "Student" s ON s."id" = st."studentId"
    JOIN "Subject" sub ON sub."id" = st."subjectId"
    WHERE s."gradeLevel" = ${gradeLevel}
      AND st."termId" IN (${Prisma.join(terms.map((t) => t.id))})
    GROUP BY st."termId", sub."id"
    ORDER BY sub."name" ASC
  `);

  return buildSubjectSeries(rows, terms);
}

function buildSubjectSeries(
  rows: Array<{ termId: string; subjectId: string; subjectName: string; avgScore: number }>,
  terms: Array<{ id: string; trimester: string }>
): SubjectTrendSeries[] {
  const termIndex = new Map(terms.map((term) => [term.id, term]));
  const grouped = new Map<string, SubjectTrendSeries>();

  for (const row of rows) {
    const existing = grouped.get(row.subjectId);
    const point = {
      termId: row.termId,
      label: formatTermLabel(termIndex.get(row.termId)?.trimester ?? row.termId),
      value: Number(row.avgScore),
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
          label: formatTermLabel(term.trimester),
          value: 0,
        }
      );
    }),
  }));
}
