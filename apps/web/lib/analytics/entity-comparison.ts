import { Prisma } from "@school-analytics/db/client";

import { prisma } from "@/lib/prisma";

export type ComparableEntityType = "GRADE" | "CLASS" | "STUDENT";

export interface ComparableEntity {
  key: string;
  type: ComparableEntityType;
  id: string;
  label: string;
  sublabel?: string;
  averageScore: number;
  criterionA: number;
  criterionB: number;
  criterionC: number;
  criterionD: number;
  cohortSize: number;
}

function toNumber(value: number | null | undefined) {
  return Number(value ?? 0);
}

export async function getComparableEntitiesForTerm(termId: string): Promise<ComparableEntity[]> {
  const [grades, classes, students] = await Promise.all([
    prisma.$queryRaw<
      Array<{
        id: string;
        label: string;
        averageScore: number;
        criterionA: number;
        criterionB: number;
        criterionC: number;
        criterionD: number;
        cohortSize: number;
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
      )
      SELECT gl."name" AS id,
             CONCAT('Level ', gl."name") AS label,
             AVG(student_course."criterionA")::float AS "criterionA",
             AVG(student_course."criterionB")::float AS "criterionB",
             AVG(student_course."criterionC")::float AS "criterionC",
             AVG(student_course."criterionD")::float AS "criterionD",
             AVG((student_course."criterionA" + student_course."criterionB" + student_course."criterionC" + student_course."criterionD") / 4.0)::float AS "averageScore",
             COUNT(DISTINCT student_course."studentId")::int AS "cohortSize"
      FROM student_course
      JOIN "Course" c ON c."id" = student_course."courseId"
      JOIN "GradeLevel" gl ON gl."id" = c."gradeLevelId"
      GROUP BY gl."name"
      ORDER BY gl."name"::int ASC
    `),
    prisma.$queryRaw<
      Array<{
        id: string;
        label: string;
        gradeLabel: string | null;
        averageScore: number;
        criterionA: number;
        criterionB: number;
        criterionC: number;
        criterionD: number;
        cohortSize: number;
      }>
    >(Prisma.sql`
      WITH student_course AS (
        SELECT ge."studentId",
               cs."id" AS "classId",
               cs."name" AS "className",
               gl."name" AS "gradeLabel",
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
        WHERE cs."academicTermId" = ${termId}
        GROUP BY ge."studentId", cs."id", cs."name", gl."name"
      )
      SELECT "classId" AS id,
             "className" AS label,
             MIN("gradeLabel") AS "gradeLabel",
             AVG("criterionA")::float AS "criterionA",
             AVG("criterionB")::float AS "criterionB",
             AVG("criterionC")::float AS "criterionC",
             AVG("criterionD")::float AS "criterionD",
             AVG(("criterionA" + "criterionB" + "criterionC" + "criterionD") / 4.0)::float AS "averageScore",
             COUNT(DISTINCT "studentId")::int AS "cohortSize"
      FROM student_course
      GROUP BY "classId", "className"
      ORDER BY "className" ASC
    `),
    prisma.$queryRaw<
      Array<{
        id: string;
        label: string;
        gradeLabel: string | null;
        averageScore: number;
        criterionA: number;
        criterionB: number;
        criterionC: number;
        criterionD: number;
        cohortSize: number;
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
               AVG("criterionA")::float AS "criterionA",
               AVG("criterionB")::float AS "criterionB",
               AVG("criterionC")::float AS "criterionC",
               AVG("criterionD")::float AS "criterionD",
               AVG(("criterionA" + "criterionB" + "criterionC" + "criterionD") / 4.0)::float AS "averageScore"
        FROM student_course
        GROUP BY "studentId"
      ),
      grade_levels AS (
        SELECT student_course."studentId",
               MIN(gl."name") AS "gradeLabel"
        FROM student_course
        JOIN "Course" c ON c."id" = student_course."courseId"
        JOIN "GradeLevel" gl ON gl."id" = c."gradeLevelId"
        GROUP BY student_course."studentId"
      )
      SELECT s."id" AS id,
             COALESCE(u."displayName", CONCAT_WS(' ', s."firstName", s."lastName"), u."email") AS label,
             grade_levels."gradeLabel" AS "gradeLabel",
             student_stats."criterionA"::float AS "criterionA",
             student_stats."criterionB"::float AS "criterionB",
             student_stats."criterionC"::float AS "criterionC",
             student_stats."criterionD"::float AS "criterionD",
             student_stats."averageScore"::float AS "averageScore",
             1::int AS "cohortSize"
      FROM student_stats
      JOIN "Student" s ON s."id" = student_stats."studentId"
      JOIN "User" u ON u."id" = s."userId"
      LEFT JOIN grade_levels ON grade_levels."studentId" = student_stats."studentId"
      ORDER BY label ASC
    `),
  ]);

  return [
    ...grades.map((entity) => ({
      key: `GRADE:${entity.id}`,
      type: "GRADE" as const,
      id: entity.id,
      label: entity.label,
      averageScore: toNumber(entity.averageScore),
      criterionA: toNumber(entity.criterionA),
      criterionB: toNumber(entity.criterionB),
      criterionC: toNumber(entity.criterionC),
      criterionD: toNumber(entity.criterionD),
      cohortSize: toNumber(entity.cohortSize),
    })),
    ...classes.map((entity) => ({
      key: `CLASS:${entity.id}`,
      type: "CLASS" as const,
      id: entity.id,
      label: entity.label,
      sublabel: entity.gradeLabel ? `Level ${entity.gradeLabel}` : undefined,
      averageScore: toNumber(entity.averageScore),
      criterionA: toNumber(entity.criterionA),
      criterionB: toNumber(entity.criterionB),
      criterionC: toNumber(entity.criterionC),
      criterionD: toNumber(entity.criterionD),
      cohortSize: toNumber(entity.cohortSize),
    })),
    ...students.map((entity) => ({
      key: `STUDENT:${entity.id}`,
      type: "STUDENT" as const,
      id: entity.id,
      label: entity.label,
      sublabel: entity.gradeLabel ? `Level ${entity.gradeLabel}` : undefined,
      averageScore: toNumber(entity.averageScore),
      criterionA: toNumber(entity.criterionA),
      criterionB: toNumber(entity.criterionB),
      criterionC: toNumber(entity.criterionC),
      criterionD: toNumber(entity.criterionD),
      cohortSize: 1,
    })),
  ];
}
