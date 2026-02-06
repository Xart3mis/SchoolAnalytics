import { Prisma } from "@school-analytics/db/client";

import { RISK_THRESHOLDS } from "@/lib/analytics/config";
import { mypCriteriaTotalSql, mypFinalGradeSql } from "@/lib/analytics/sql";
import { prisma } from "@/lib/prisma";

export type StudentListRow = {
  id: string;
  fullName: string;
  gradeLevel: number;
  averageScore: number;
  riskLevel: "High" | "Medium" | "Low";
};

export type ClassListRow = {
  id: string;
  name: string;
  gradeLevel: number;
  academicYear: string;
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
  const totalExpression = mypCriteriaTotalSql();
  const finalGradeExpression = mypFinalGradeSql(totalExpression);
  const search = query?.trim();
  const searchClause = search
    ? Prisma.sql`AND LOWER(COALESCE(u."displayName", CONCAT_WS(' ', s."firstName", s."lastName"), u."email")) LIKE ${`%${search.toLowerCase()}%`}`
    : Prisma.empty;

  const rows = await prisma.$queryRaw<
    Array<{ id: string; fullName: string; gradeLevel: number; averageScore: number }>
  >(Prisma.sql`
    WITH final_grades AS (
      SELECT ge."studentId",
             cs."courseId" AS "courseId",
             ${finalGradeExpression}::int AS "finalGrade"
      FROM "GradeEntry" ge
      JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      WHERE cs."academicTermId" = ${termId}
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
    SELECT s."id",
           COALESCE(u."displayName", CONCAT_WS(' ', s."firstName", s."lastName"), u."email") AS "fullName",
           grade_levels."gradeLevel" AS "gradeLevel",
           student_stats."avgGrade"::float AS "averageScore"
    FROM student_stats
    JOIN grade_levels ON grade_levels."studentId" = student_stats."studentId"
    JOIN "Student" s ON s."id" = student_stats."studentId"
    JOIN "User" u ON u."id" = s."userId"
    WHERE 1 = 1
    ${searchClause}
    ORDER BY "averageScore" ASC
    LIMIT ${pageSize} OFFSET ${offset}
  `);

  const total = await prisma.$queryRaw<{ count: number }[]>(Prisma.sql`
    WITH final_grades AS (
      SELECT ge."studentId",
             cs."courseId" AS "courseId",
             ${finalGradeExpression}::int AS "finalGrade"
      FROM "GradeEntry" ge
      JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      WHERE cs."academicTermId" = ${termId}
      GROUP BY ge."studentId", cs."courseId"
    ),
    student_stats AS (
      SELECT "studentId", AVG("finalGrade")::float AS "avgGrade"
      FROM final_grades
      GROUP BY "studentId"
    )
    SELECT COUNT(*)::int AS count
    FROM student_stats
    JOIN "Student" s ON s."id" = student_stats."studentId"
    JOIN "User" u ON u."id" = s."userId"
    WHERE 1 = 1
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

export async function getClassList(termId: string, query?: string) {
  const search = query?.trim();
  const searchClause = search
    ? Prisma.sql`AND (
        LOWER(cs."name") LIKE ${`%${search.toLowerCase()}%`}
        OR LOWER(c."name") LIKE ${`%${search.toLowerCase()}%`}
      )`
    : Prisma.empty;

  return prisma.$queryRaw<ClassListRow[]>(Prisma.sql`
    SELECT cs."id",
           cs."name",
           gl."name"::int AS "gradeLevel",
           ay."name" AS "academicYear"
    FROM "ClassSection" cs
    JOIN "Course" c ON c."id" = cs."courseId"
    JOIN "GradeLevel" gl ON gl."id" = c."gradeLevelId"
    JOIN "AcademicYear" ay ON ay."id" = cs."academicYearId"
    WHERE cs."academicTermId" = ${termId}
    ${searchClause}
    ORDER BY gl."name"::int ASC, cs."name" ASC
  `);
}
