import { Prisma } from "@prisma/client";

import { RISK_THRESHOLDS } from "@/lib/analytics/config";
import { mypCriteriaTotalSql, mypFinalGradeSql } from "@/lib/analytics/sql";
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
  const activeTerm = termId
    ? await prisma.academicTerm.findUnique({
        where: { id: termId },
        include: { academicYear: true },
      })
    : await prisma.academicTerm.findFirst({
        orderBy: { startDate: "desc" },
        include: { academicYear: true },
      });

  if (!activeTerm) {
    return {
      kpis: [],
      performanceTrend: [],
      gradeDistribution: [],
      atRisk: [],
      activeTermLabel: "No term data",
    };
  }

  const terms = await prisma.academicTerm.findMany({
    where: { academicYearId: activeTerm.academicYearId },
    orderBy: { startDate: "asc" },
  });

  const termIds = terms.map((term) => term.id);
  const totalExpression = mypCriteriaTotalSql();
  const finalGradeExpression = mypFinalGradeSql(totalExpression);

  const termAverages = termIds.length
    ? await prisma.$queryRaw<{ termId: string; avgGrade: number }[]>(
        Prisma.sql`
          WITH final_grades AS (
            SELECT ge."studentId",
                   cs."academicTermId" AS "termId",
                   cs."courseId" AS "courseId",
                   ${finalGradeExpression}::int AS "finalGrade"
            FROM "GradeEntry" ge
            JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
            JOIN "Assignment" a ON a."id" = ge."assignmentId"
            JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
            WHERE cs."academicTermId" IN (${Prisma.join(termIds)})
            GROUP BY ge."studentId", cs."academicTermId", cs."courseId"
          )
          SELECT "termId", AVG("finalGrade")::float AS "avgGrade"
          FROM final_grades
          GROUP BY "termId"
        `
      )
    : [];

  const termAverageMap = new Map(
    termAverages.map((row) => [row.termId, Number(row.avgGrade)])
  );

  const gradeGroups = await prisma.$queryRaw<
    Array<{ gradeLevel: number; count: number }>
  >(Prisma.sql`
    WITH final_grades AS (
      SELECT ge."studentId",
             cs."courseId" AS "courseId",
             ${finalGradeExpression}::int AS "finalGrade"
      FROM "GradeEntry" ge
      JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      WHERE cs."academicTermId" = ${activeTerm.id}
      GROUP BY ge."studentId", cs."courseId"
    )
    SELECT gl."name"::int AS "gradeLevel",
           COUNT(DISTINCT final_grades."studentId")::int AS count
    FROM final_grades
    JOIN "Course" c ON c."id" = final_grades."courseId"
    JOIN "GradeLevel" gl ON gl."id" = c."gradeLevelId"
    GROUP BY gl."name"
    ORDER BY gl."name"::int ASC
  `);

  const [{ totalStudents, averageScore, highRiskCount } = { totalStudents: 0, averageScore: 0, highRiskCount: 0 }] =
    await prisma.$queryRaw<
      { totalStudents: number; averageScore: number; highRiskCount: number }[]
    >(Prisma.sql`
      SELECT
        COUNT(*)::int AS "totalStudents",
        AVG(stats."avgGrade")::float AS "averageScore",
        SUM(CASE WHEN stats."avgGrade" <= ${RISK_THRESHOLDS.high} THEN 1 ELSE 0 END)::int AS "highRiskCount"
      FROM (
        WITH final_grades AS (
          SELECT ge."studentId",
                 cs."courseId" AS "courseId",
                 ${finalGradeExpression}::int AS "finalGrade"
          FROM "GradeEntry" ge
          JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
          JOIN "Assignment" a ON a."id" = ge."assignmentId"
          JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
          WHERE cs."academicTermId" = ${activeTerm.id}
          GROUP BY ge."studentId", cs."courseId"
        )
        SELECT "studentId", AVG("finalGrade")::float AS "avgGrade"
        FROM final_grades
        GROUP BY "studentId"
      ) AS stats
    `);

  const atRiskRows = await prisma.$queryRaw<
    { studentId: string; fullName: string; gradeLevel: number; avgScore: number }[]
  >(Prisma.sql`
    WITH final_grades AS (
      SELECT ge."studentId",
             cs."courseId" AS "courseId",
             ${finalGradeExpression}::int AS "finalGrade"
      FROM "GradeEntry" ge
      JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      WHERE cs."academicTermId" = ${activeTerm.id}
      GROUP BY ge."studentId", cs."courseId"
    ),
    student_stats AS (
      SELECT "studentId", AVG("finalGrade")::float AS "avgGrade"
      FROM final_grades
      GROUP BY "studentId"
    ),
    grade_levels AS (
      SELECT final_grades."studentId", MIN(gl."name")::int AS "gradeLevel"
      FROM final_grades
      JOIN "Course" c ON c."id" = final_grades."courseId"
      JOIN "GradeLevel" gl ON gl."id" = c."gradeLevelId"
      GROUP BY final_grades."studentId"
    )
    SELECT s."id" AS "studentId",
           COALESCE(u."displayName", CONCAT_WS(' ', s."firstName", s."lastName"), u."email") AS "fullName",
           grade_levels."gradeLevel" AS "gradeLevel",
           student_stats."avgGrade"::float AS "avgScore"
    FROM student_stats
    JOIN grade_levels ON grade_levels."studentId" = student_stats."studentId"
    JOIN "Student" s ON s."id" = student_stats."studentId"
    JOIN "User" u ON u."id" = s."userId"
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
        label: "Average Final Grade",
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
        value: `${activeTerm.name}`,
      },
    ],
    performanceTrend: terms.map((term) => ({
      label: term.name,
      value: Number(termAverageMap.get(term.id) ?? 0),
    })),
    gradeDistribution: gradeGroups.map((group) => ({
      label: `Grade ${group.gradeLevel}`,
      value: group.count,
    })),
    atRisk: atRiskRows.map((row) => ({
      id: row.studentId,
      name: row.fullName,
      gradeLevel: `Grade ${row.gradeLevel}`,
      averageScore: Number(row.avgScore),
      riskLevel: riskLevel(Number(row.avgScore)),
    })),
    activeTermLabel: `${activeTerm.academicYear.name} ${activeTerm.name}`,
  };
}
