import { Prisma } from "@prisma/client";

import { RISK_THRESHOLDS } from "@/lib/analytics/config";
import { weightedScoreSql } from "@/lib/analytics/sql";
import { prisma } from "@/lib/prisma";

export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  delta?: string;
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface DistributionSlice {
  label: string;
  value: number;
}

export interface AtRiskStudent {
  id: string;
  name: string;
  gradeLevel: string;
  averageScore: number;
  riskLevel: "High" | "Medium" | "Low";
}

export interface DashboardData {
  kpis: KpiMetric[];
  performanceTrend: TrendPoint[];
  gradeDistribution: DistributionSlice[];
  atRisk: AtRiskStudent[];
  activeTermLabel: string;
}

function riskLevel(score: number) {
  if (score <= RISK_THRESHOLDS.high) return "High";
  if (score <= RISK_THRESHOLDS.medium) return "Medium";
  return "Low";
}

export async function getDashboardData(termId?: string): Promise<DashboardData> {
  const activeTerm =
    termId
      ? await prisma.term.findUnique({ where: { id: termId } })
      : await prisma.term.findFirst({ orderBy: { createdAt: "desc" } });

  if (!activeTerm) {
    return {
      kpis: [],
      performanceTrend: [],
      gradeDistribution: [],
      atRisk: [],
      activeTermLabel: "No term data",
    };
  }

  const terms = await prisma.term.findMany({
    where: { academicYear: activeTerm.academicYear },
    orderBy: { trimester: "asc" },
  });

  const termIds = terms.map((term) => term.id);
  const scoreExpression = weightedScoreSql();

  const termAverages = termIds.length
    ? await prisma.$queryRaw<{ termId: string; avgScore: number }[]>(
        Prisma.sql`
          SELECT "termId", AVG(${scoreExpression})::float AS "avgScore"
          FROM "StudentSubjectTermScore"
          WHERE "termId" IN (${Prisma.join(termIds)})
          GROUP BY "termId"
        `
      )
    : [];

  const termAverageMap = new Map(
    termAverages.map((row) => [row.termId, Number(row.avgScore)])
  );

  const gradeGroups = await prisma.student.groupBy({
    by: ["gradeLevel"],
    _count: { _all: true },
    orderBy: { gradeLevel: "asc" },
  });

  const [{ totalStudents, averageScore, highRiskCount } = { totalStudents: 0, averageScore: 0, highRiskCount: 0 }] =
    await prisma.$queryRaw<
      { totalStudents: number; averageScore: number; highRiskCount: number }[]
    >(Prisma.sql`
      SELECT
        COUNT(*)::int AS "totalStudents",
        AVG(stats."avgScore")::float AS "averageScore",
        SUM(CASE WHEN stats."avgScore" <= ${RISK_THRESHOLDS.high} THEN 1 ELSE 0 END)::int AS "highRiskCount"
      FROM (
        SELECT "studentId", AVG(${scoreExpression})::float AS "avgScore"
        FROM "StudentSubjectTermScore"
        WHERE "termId" = ${activeTerm.id}
        GROUP BY "studentId"
      ) AS stats
    `);

  const atRiskRows = await prisma.$queryRaw<
    { studentId: string; fullName: string; gradeLevel: number; avgScore: number }[]
  >(Prisma.sql`
    SELECT s."id" AS "studentId",
           s."fullName",
           s."gradeLevel",
           AVG(${scoreExpression})::float AS "avgScore"
    FROM "StudentSubjectTermScore" st
    JOIN "Student" s ON s."id" = st."studentId"
    WHERE st."termId" = ${activeTerm.id}
    GROUP BY s."id"
    ORDER BY "avgScore" ASC
    LIMIT 60
  `);

  return {
    kpis: [
      {
        id: "students",
        label: "Total Students",
        value: totalStudents.toLocaleString(),
      },
      {
        id: "avg-score",
        label: "Average Score",
        value: Number(averageScore ?? 0).toFixed(2),
      },
      {
        id: "high-risk",
        label: "High Risk",
        value: Number(highRiskCount ?? 0).toLocaleString(),
      },
      {
        id: "terms",
        label: "Active Term",
        value: `${activeTerm.trimester}`,
      },
    ],
    performanceTrend: terms.map((term) => ({
      label: term.trimester,
      value: Number(termAverageMap.get(term.id) ?? 0),
    })),
    gradeDistribution: gradeGroups.map((group) => ({
      label: `Grade ${group.gradeLevel}`,
      value: group._count._all,
    })),
    atRisk: atRiskRows.map((row) => ({
      id: row.studentId,
      name: row.fullName,
      gradeLevel: `Grade ${row.gradeLevel}`,
      averageScore: Number(row.avgScore),
      riskLevel: riskLevel(Number(row.avgScore)),
    })),
    activeTermLabel: `${activeTerm.academicYear} ${activeTerm.trimester}`,
  };
}
