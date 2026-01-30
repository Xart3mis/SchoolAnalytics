import { Prisma } from "@prisma/client";

import { RISK_THRESHOLDS } from "@/lib/analytics/config";
import { weightedScoreSql } from "@/lib/analytics/sql";
import { prisma } from "@/lib/prisma";

export type RiskBreakdown = {
  label: "High" | "Medium" | "Low";
  value: number;
};

export type AtRiskRow = {
  id: string;
  fullName: string;
  gradeLevel: number;
  averageScore: number;
  riskLevel: "High" | "Medium" | "Low";
};

function riskLevel(score: number) {
  if (score <= RISK_THRESHOLDS.high) return "High";
  if (score <= RISK_THRESHOLDS.medium) return "Medium";
  return "Low";
}

export async function getClassRiskBreakdown(classId: string, termId: string) {
  const scoreExpression = weightedScoreSql();
  const rows = await prisma.$queryRaw<
    Array<{ high: number; medium: number; low: number }>
  >(Prisma.sql`
    SELECT
      SUM(CASE WHEN stats."avgScore" <= ${RISK_THRESHOLDS.high} THEN 1 ELSE 0 END)::int AS high,
      SUM(
        CASE
          WHEN stats."avgScore" > ${RISK_THRESHOLDS.high}
           AND stats."avgScore" <= ${RISK_THRESHOLDS.medium} THEN 1
          ELSE 0
        END
      )::int AS medium,
      SUM(CASE WHEN stats."avgScore" > ${RISK_THRESHOLDS.medium} THEN 1 ELSE 0 END)::int AS low
    FROM (
      SELECT "studentId", AVG(${scoreExpression})::float AS "avgScore"
      FROM "StudentSubjectTermScore"
      WHERE "classId" = ${classId} AND "termId" = ${termId}
      GROUP BY "studentId"
    ) AS stats
  `);

  const row = rows[0] ?? { high: 0, medium: 0, low: 0 };
  return [
    { label: "High", value: row.high },
    { label: "Medium", value: row.medium },
    { label: "Low", value: row.low },
  ] as RiskBreakdown[];
}

export async function getGradeRiskBreakdown(gradeLevel: number, termId: string) {
  const scoreExpression = weightedScoreSql();
  const rows = await prisma.$queryRaw<
    Array<{ high: number; medium: number; low: number }>
  >(Prisma.sql`
    SELECT
      SUM(CASE WHEN stats."avgScore" <= ${RISK_THRESHOLDS.high} THEN 1 ELSE 0 END)::int AS high,
      SUM(
        CASE
          WHEN stats."avgScore" > ${RISK_THRESHOLDS.high}
           AND stats."avgScore" <= ${RISK_THRESHOLDS.medium} THEN 1
          ELSE 0
        END
      )::int AS medium,
      SUM(CASE WHEN stats."avgScore" > ${RISK_THRESHOLDS.medium} THEN 1 ELSE 0 END)::int AS low
    FROM (
      SELECT st."studentId", AVG(${scoreExpression})::float AS "avgScore"
      FROM "StudentSubjectTermScore" st
      JOIN "Student" s ON s."id" = st."studentId"
      WHERE s."gradeLevel" = ${gradeLevel} AND st."termId" = ${termId}
      GROUP BY st."studentId"
    ) AS stats
  `);

  const row = rows[0] ?? { high: 0, medium: 0, low: 0 };
  return [
    { label: "High", value: row.high },
    { label: "Medium", value: row.medium },
    { label: "Low", value: row.low },
  ] as RiskBreakdown[];
}

export async function getClassAtRiskList(classId: string, termId: string, limit = 20) {
  const scoreExpression = weightedScoreSql();
  const rows = await prisma.$queryRaw<
    Array<{ id: string; fullName: string; gradeLevel: number; avgScore: number }>
  >(Prisma.sql`
    SELECT s."id",
           s."fullName",
           s."gradeLevel",
           AVG(${scoreExpression})::float AS "avgScore"
    FROM "StudentSubjectTermScore" st
    JOIN "Student" s ON s."id" = st."studentId"
    WHERE st."classId" = ${classId} AND st."termId" = ${termId}
    GROUP BY s."id"
    ORDER BY "avgScore" ASC
    LIMIT ${limit}
  `);

  return rows.map((row) => ({
    id: row.id,
    fullName: row.fullName,
    gradeLevel: row.gradeLevel,
    averageScore: Number(row.avgScore),
    riskLevel: riskLevel(Number(row.avgScore)),
  })) as AtRiskRow[];
}

export async function getGradeAtRiskList(gradeLevel: number, termId: string, limit = 20) {
  const scoreExpression = weightedScoreSql();
  const rows = await prisma.$queryRaw<
    Array<{ id: string; fullName: string; gradeLevel: number; avgScore: number }>
  >(Prisma.sql`
    SELECT s."id",
           s."fullName",
           s."gradeLevel",
           AVG(${scoreExpression})::float AS "avgScore"
    FROM "StudentSubjectTermScore" st
    JOIN "Student" s ON s."id" = st."studentId"
    WHERE s."gradeLevel" = ${gradeLevel} AND st."termId" = ${termId}
    GROUP BY s."id"
    ORDER BY "avgScore" ASC
    LIMIT ${limit}
  `);

  return rows.map((row) => ({
    id: row.id,
    fullName: row.fullName,
    gradeLevel: row.gradeLevel,
    averageScore: Number(row.avgScore),
    riskLevel: riskLevel(Number(row.avgScore)),
  })) as AtRiskRow[];
}
