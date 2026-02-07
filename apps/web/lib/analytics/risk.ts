import { Prisma } from "@school-analytics/db/client";

import { RISK_THRESHOLDS } from "@/lib/analytics/config";
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

export async function getClassRiskBreakdown(classSectionId: string, termId: string) {
  const rows = await prisma.$queryRaw<
    Array<{ high: number; medium: number; low: number }>
  >(Prisma.sql`
    SELECT
      SUM(CASE WHEN stats."criterionAvg" <= ${RISK_THRESHOLDS.high} THEN 1 ELSE 0 END)::int AS high,
      SUM(
        CASE
          WHEN stats."criterionAvg" > ${RISK_THRESHOLDS.high}
           AND stats."criterionAvg" <= ${RISK_THRESHOLDS.medium} THEN 1
          ELSE 0
        END
      )::int AS medium,
      SUM(CASE WHEN stats."criterionAvg" > ${RISK_THRESHOLDS.medium} THEN 1 ELSE 0 END)::int AS low
    FROM (
      WITH student_course AS (
        SELECT ge."studentId",
               cs."courseId" AS "courseId",
               COALESCE(MAX(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionA",
               COALESCE(MAX(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionB",
               COALESCE(MAX(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionC",
               COALESCE(MAX(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionD"
        FROM "GradeEntry" ge
        JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
        JOIN "Assignment" a ON a."id" = ge."assignmentId"
        JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
        WHERE cs."id" = ${classSectionId} AND cs."academicTermId" = ${termId}
        GROUP BY ge."studentId", cs."courseId"
      )
      SELECT "studentId",
             AVG(("criterionA" + "criterionB" + "criterionC" + "criterionD") / 4.0)::float AS "criterionAvg"
      FROM student_course
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
  const rows = await prisma.$queryRaw<
    Array<{ high: number; medium: number; low: number }>
  >(Prisma.sql`
    SELECT
      SUM(CASE WHEN stats."criterionAvg" <= ${RISK_THRESHOLDS.high} THEN 1 ELSE 0 END)::int AS high,
      SUM(
        CASE
          WHEN stats."criterionAvg" > ${RISK_THRESHOLDS.high}
           AND stats."criterionAvg" <= ${RISK_THRESHOLDS.medium} THEN 1
          ELSE 0
        END
      )::int AS medium,
      SUM(CASE WHEN stats."criterionAvg" > ${RISK_THRESHOLDS.medium} THEN 1 ELSE 0 END)::int AS low
    FROM (
      WITH student_course AS (
        SELECT ge."studentId",
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
        WHERE gl."name" = ${String(gradeLevel)} AND cs."academicTermId" = ${termId}
        GROUP BY ge."studentId", cs."courseId"
      )
      SELECT "studentId",
             AVG(("criterionA" + "criterionB" + "criterionC" + "criterionD") / 4.0)::float AS "criterionAvg"
      FROM student_course
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

export async function getClassAtRiskList(classSectionId: string, termId: string, limit = 20) {
  const rows = await prisma.$queryRaw<
    Array<{ id: string; fullName: string; gradeLevel: number; avgScore: number }>
  >(Prisma.sql`
    WITH student_course AS (
      SELECT ge."studentId",
             cs."courseId" AS "courseId",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionA",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionB",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionC",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionD"
      FROM "GradeEntry" ge
      JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      WHERE cs."id" = ${classSectionId} AND cs."academicTermId" = ${termId}
      GROUP BY ge."studentId", cs."courseId"
    ),
    student_stats AS (
      SELECT "studentId",
             AVG(("criterionA" + "criterionB" + "criterionC" + "criterionD") / 4.0)::float AS "avgGrade"
      FROM student_course
      GROUP BY "studentId"
    ),
    grade_levels AS (
      SELECT student_course."studentId", MIN(gl."name")::int AS "gradeLevel"
      FROM student_course
      JOIN "Course" c ON c."id" = student_course."courseId"
      JOIN "GradeLevel" gl ON gl."id" = c."gradeLevelId"
      GROUP BY student_course."studentId"
    )
    SELECT s."id",
           COALESCE(u."displayName", CONCAT_WS(' ', s."firstName", s."lastName"), u."email") AS "fullName",
           grade_levels."gradeLevel" AS "gradeLevel",
           student_stats."avgGrade"::float AS "avgScore"
    FROM student_stats
    JOIN grade_levels ON grade_levels."studentId" = student_stats."studentId"
    JOIN "Student" s ON s."id" = student_stats."studentId"
    JOIN "User" u ON u."id" = s."userId"
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
  const rows = await prisma.$queryRaw<
    Array<{ id: string; fullName: string; gradeLevel: number; avgScore: number }>
  >(Prisma.sql`
    WITH student_course AS (
      SELECT ge."studentId",
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
      WHERE gl."name" = ${String(gradeLevel)} AND cs."academicTermId" = ${termId}
      GROUP BY ge."studentId", cs."courseId"
    ),
    student_stats AS (
      SELECT "studentId",
             AVG(("criterionA" + "criterionB" + "criterionC" + "criterionD") / 4.0)::float AS "avgGrade"
      FROM student_course
      GROUP BY "studentId"
    )
    SELECT s."id",
           COALESCE(u."displayName", CONCAT_WS(' ', s."firstName", s."lastName"), u."email") AS "fullName",
           ${gradeLevel}::int AS "gradeLevel",
           student_stats."avgGrade"::float AS "avgScore"
    FROM student_stats
    JOIN "Student" s ON s."id" = student_stats."studentId"
    JOIN "User" u ON u."id" = s."userId"
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
