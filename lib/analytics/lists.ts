import { Prisma } from "@prisma/client";

import { RISK_THRESHOLDS } from "@/lib/analytics/config";
import { weightedScoreSql } from "@/lib/analytics/sql";
import { prisma } from "@/lib/prisma";

export type StudentListRow = {
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

export async function getStudentList({
  termId,
  page,
  pageSize,
  query,
}: {
  termId: string;
  page: number;
  pageSize: number;
  query?: string;
}) {
  const offset = (page - 1) * pageSize;
  const scoreExpression = weightedScoreSql();
  const search = query?.trim();
  const searchClause = search
    ? Prisma.sql`AND LOWER(s."fullName") LIKE ${`%${search.toLowerCase()}%`}`
    : Prisma.empty;

  const rows = await prisma.$queryRaw<
    Array<{ id: string; fullName: string; gradeLevel: number; averageScore: number }>
  >(Prisma.sql`
    SELECT s."id",
           s."fullName",
           s."gradeLevel",
           AVG(${scoreExpression})::float AS "averageScore"
    FROM "StudentSubjectTermScore" st
    JOIN "Student" s ON s."id" = st."studentId"
    WHERE st."termId" = ${termId}
    ${searchClause}
    GROUP BY s."id"
    ORDER BY "averageScore" ASC
    LIMIT ${pageSize} OFFSET ${offset}
  `);

  const total = await prisma.$queryRaw<{ count: number }[]>(Prisma.sql`
    SELECT COUNT(DISTINCT st."studentId")::int AS count
    FROM "StudentSubjectTermScore" st
    JOIN "Student" s ON s."id" = st."studentId"
    WHERE st."termId" = ${termId}
    ${searchClause}
  `);

  return {
    rows: rows.map((row) => ({
      ...row,
      averageScore: Number(row.averageScore),
      riskLevel: riskLevel(Number(row.averageScore)),
    })) as StudentListRow[],
    total: total[0]?.count ?? 0,
  };
}

export async function getClassList(academicYear: string) {
  return prisma.class.findMany({
    where: { academicYear },
    orderBy: [{ gradeLevel: "asc" }, { name: "asc" }],
  });
}
