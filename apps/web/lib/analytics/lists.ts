import { Prisma } from "@school-analytics/db/client";

import { RISK_THRESHOLDS } from "@/lib/analytics/config";
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
  averageScore: number;
  studentCount: number;
};

function riskLevel(score: number): "High" | "Medium" | "Low" {
  if (score <= RISK_THRESHOLDS.high) return "High";
  if (score <= RISK_THRESHOLDS.medium) return "Medium";
  return "Low";
}

export async function getStudentList({
  termId,
  page,
  pageSize,
  query,
  gradeLevel,
}: {
  termId: string;
  page: number;
  pageSize: number;
  query?: string;
  gradeLevel?: number;
}) {
  const offset = (page - 1) * pageSize;
  const search = query?.trim();
  const searchClause = search
    ? Prisma.sql`AND LOWER(COALESCE(u."displayName", CONCAT_WS(' ', s."firstName", s."lastName"), u."email")) LIKE ${`%${search.toLowerCase()}%`}`
    : Prisma.empty;
  const gradeClause =
    typeof gradeLevel === "number"
      ? Prisma.sql`AND grade_levels."gradeLevel" = ${gradeLevel}`
      : Prisma.empty;

  const rows = await prisma.$queryRaw<
    Array<{
      id: string;
      fullName: string;
      gradeLevel: number;
      averageScore: number;
      totalCount: number;
    }>
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
      WHERE cs."academicTermId" = ${termId}
      GROUP BY ge."studentId", cs."courseId"
    ),
    student_stats AS (
      SELECT "studentId",
             AVG(("criterionA" + "criterionB" + "criterionC" + "criterionD") / 4.0)::float AS "avgGrade"
      FROM student_course
      GROUP BY "studentId"
    ),
    grade_levels AS (
      SELECT student_course."studentId",
             MIN(NULLIF(regexp_replace(gl."name", '\D', '', 'g'), '')::int) AS "gradeLevel"
      FROM student_course
      JOIN "Course" c ON c."id" = student_course."courseId"
      JOIN "GradeLevel" gl ON gl."id" = c."gradeLevelId"
      GROUP BY student_course."studentId"
    )
    SELECT s."id",
           COALESCE(u."displayName", CONCAT_WS(' ', s."firstName", s."lastName"), u."email") AS "fullName",
           grade_levels."gradeLevel" AS "gradeLevel",
           student_stats."avgGrade"::float AS "averageScore",
           COUNT(*) OVER()::int AS "totalCount"
    FROM student_stats
    JOIN grade_levels ON grade_levels."studentId" = student_stats."studentId"
    JOIN "Student" s ON s."id" = student_stats."studentId"
    JOIN "User" u ON u."id" = s."userId"
    WHERE 1 = 1
    ${searchClause}
    ${gradeClause}
    ORDER BY "averageScore" ASC
    LIMIT ${pageSize} OFFSET ${offset}
  `);

  return {
    rows: rows.map((row) => {
      const averageScore = Number(row.averageScore);
      return {
        id: row.id,
        fullName: row.fullName,
        gradeLevel: row.gradeLevel,
        averageScore,
        riskLevel: riskLevel(averageScore),
      };
    }),
    total: rows[0]?.totalCount ?? 0,
  };
}

export async function getClassList(
  termId: string,
  query?: string,
  gradeLevel?: number,
) {
  const search = query?.trim();
  const searchClause = search
    ? Prisma.sql`AND (
        LOWER(cs."name") LIKE ${`%${search.toLowerCase()}%`}
        OR LOWER(c."name") LIKE ${`%${search.toLowerCase()}%`}
      )`
    : Prisma.empty;
  const gradeClause =
    typeof gradeLevel === "number"
      ? Prisma.sql`AND gl."name"::int = ${gradeLevel}`
      : Prisma.empty;

  return prisma.$queryRaw<ClassListRow[]>(Prisma.sql`
    WITH student_course AS (
      SELECT ge."studentId",
             cs."id" AS "classId",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionA",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionB",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionC",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionD"
      FROM "GradeEntry" ge
      JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      WHERE cs."academicTermId" = ${termId}
      GROUP BY ge."studentId", cs."id"
    ),
    class_stats AS (
      SELECT "classId",
             AVG(("criterionA" + "criterionB" + "criterionC" + "criterionD") / 4.0)::float AS "averageScore",
             COUNT(DISTINCT "studentId")::int AS "studentCount"
      FROM student_course
      GROUP BY "classId"
    )
    SELECT cs."id",
           cs."name",
           gl."name"::int AS "gradeLevel",
           ay."name" AS "academicYear",
           COALESCE(class_stats."averageScore", 0)::float AS "averageScore",
           COALESCE(class_stats."studentCount", 0)::int AS "studentCount"
    FROM "ClassSection" cs
    JOIN "Course" c ON c."id" = cs."courseId"
    JOIN "GradeLevel" gl ON gl."id" = c."gradeLevelId"
    JOIN "AcademicYear" ay ON ay."id" = cs."academicYearId"
    LEFT JOIN class_stats ON class_stats."classId" = cs."id"
    WHERE cs."academicTermId" = ${termId}
    ${searchClause}
    ${gradeClause}
    ORDER BY class_stats."averageScore" DESC NULLS LAST, gl."name"::int ASC, cs."name" ASC
  `);
}
