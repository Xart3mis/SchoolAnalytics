import { Prisma } from "@school-analytics/db/client";

import { RISK_THRESHOLDS } from "@/lib/analytics/config";
import { prisma } from "@/lib/prisma";

export type SubjectStat = {
  subjectId: string;
  subjectName: string;
  averageScore: number;
  assessmentCount: number;
  criterionA: number;
  criterionB: number;
  criterionC: number;
  criterionD: number;
};

export type OverallStat = {
  averageScore: number;
  riskLevel: "High" | "Medium" | "Low";
};

export type PercentileCompositeStat = {
  composite: number;
  subjectCount: number;
  trimmedSubjectCount: number;
};

export type CriteriaSummary = {
  criterionA: number;
  criterionB: number;
  criterionC: number;
  criterionD: number;
};

function riskLevel(score: number) {
  if (score <= RISK_THRESHOLDS.high) return "High";
  if (score <= RISK_THRESHOLDS.medium) return "Medium";
  return "Low";
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export async function getStudentSubjectStats(studentId: string, termId: string) {
  const rows = await prisma.$queryRaw<
    Array<{
      subjectId: string;
      subjectName: string;
      averageScore: number;
      assessmentCount: number;
      criterionA: number;
      criterionB: number;
      criterionC: number;
      criterionD: number;
    }>
  >(Prisma.sql`
    SELECT c."id" AS "subjectId",
           c."name" AS "subjectName",
           (
             COALESCE(MAX(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END), 0)
             + COALESCE(MAX(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END), 0)
             + COALESCE(MAX(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END), 0)
             + COALESCE(MAX(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END), 0)
           )::float / 4.0 AS "averageScore",
           COUNT(DISTINCT ge."id")::int AS "assessmentCount",
           COALESCE(MAX(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionA",
           COALESCE(MAX(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionB",
           COALESCE(MAX(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionC",
           COALESCE(MAX(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionD"
    FROM "GradeEntry" ge
    JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
    JOIN "Assignment" a ON a."id" = ge."assignmentId"
    JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
    JOIN "Course" c ON c."id" = cs."courseId"
    WHERE ge."studentId" = ${studentId} AND cs."academicTermId" = ${termId}
    GROUP BY c."id", c."name"
    ORDER BY c."name" ASC
  `);

  return rows;
}

export async function getClassSubjectStats(classSectionId: string, termId: string) {
  const rows = await prisma.$queryRaw<SubjectStat[]>(Prisma.sql`
    WITH student_course AS (
      SELECT ge."studentId",
             cs."courseId" AS "courseId",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionA",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionB",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionC",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionD"
      FROM "GradeEntry" ge
      JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      WHERE cs."id" = ${classSectionId} AND cs."academicTermId" = ${termId}
      GROUP BY ge."studentId", cs."courseId"
    ),
    assessment_counts AS (
      SELECT cs."courseId" AS "courseId",
             COUNT(ge."id")::int AS "assessmentCount"
      FROM "GradeEntry" ge
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      WHERE cs."id" = ${classSectionId} AND cs."academicTermId" = ${termId}
      GROUP BY cs."courseId"
    )
    SELECT c."id" AS "subjectId",
           c."name" AS "subjectName",
           (
             AVG(student_course."criterionA")
             + AVG(student_course."criterionB")
             + AVG(student_course."criterionC")
             + AVG(student_course."criterionD")
           )::float / 4.0 AS "averageScore",
           AVG(student_course."criterionA")::float AS "criterionA",
           AVG(student_course."criterionB")::float AS "criterionB",
           AVG(student_course."criterionC")::float AS "criterionC",
           AVG(student_course."criterionD")::float AS "criterionD",
           COALESCE(assessment_counts."assessmentCount", 0)::int AS "assessmentCount"
    FROM student_course
    JOIN "Course" c ON c."id" = student_course."courseId"
    LEFT JOIN assessment_counts ON assessment_counts."courseId" = student_course."courseId"
    GROUP BY c."id", c."name", assessment_counts."assessmentCount"
    ORDER BY c."name" ASC
  `);

  return rows;
}

export async function getGradeSubjectStats(gradeLevel: number, termId: string) {
  const rows = await prisma.$queryRaw<SubjectStat[]>(Prisma.sql`
    WITH student_course AS (
      SELECT ge."studentId",
             cs."courseId" AS "courseId",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionA",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionB",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionC",
             COALESCE(MAX(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionD"
      FROM "GradeEntry" ge
      JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      JOIN "Course" c ON c."id" = cs."courseId"
      JOIN "GradeLevel" gl ON gl."id" = c."gradeLevelId"
      WHERE gl."name" = ${String(gradeLevel)} AND cs."academicTermId" = ${termId}
      GROUP BY ge."studentId", cs."courseId"
    ),
    assessment_counts AS (
      SELECT cs."courseId" AS "courseId",
             COUNT(ge."id")::int AS "assessmentCount"
      FROM "GradeEntry" ge
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      JOIN "Course" c ON c."id" = cs."courseId"
      JOIN "GradeLevel" gl ON gl."id" = c."gradeLevelId"
      WHERE gl."name" = ${String(gradeLevel)} AND cs."academicTermId" = ${termId}
      GROUP BY cs."courseId"
    )
    SELECT c."id" AS "subjectId",
           c."name" AS "subjectName",
           (
             AVG(student_course."criterionA")
             + AVG(student_course."criterionB")
             + AVG(student_course."criterionC")
             + AVG(student_course."criterionD")
           )::float / 4.0 AS "averageScore",
           AVG(student_course."criterionA")::float AS "criterionA",
           AVG(student_course."criterionB")::float AS "criterionB",
           AVG(student_course."criterionC")::float AS "criterionC",
           AVG(student_course."criterionD")::float AS "criterionD",
           COALESCE(assessment_counts."assessmentCount", 0)::int AS "assessmentCount"
    FROM student_course
    JOIN "Course" c ON c."id" = student_course."courseId"
    LEFT JOIN assessment_counts ON assessment_counts."courseId" = student_course."courseId"
    GROUP BY c."id", c."name", assessment_counts."assessmentCount"
    ORDER BY c."name" ASC
  `);

  return rows;
}

export async function getStudentCriteriaSummary(
  studentId: string,
  termId: string
): Promise<CriteriaSummary> {
  const [{ criterionA, criterionB, criterionC, criterionD } = { criterionA: 0, criterionB: 0, criterionC: 0, criterionD: 0 }] =
    await prisma.$queryRaw<
      Array<{
        criterionA: number;
        criterionB: number;
        criterionC: number;
        criterionD: number;
      }>
    >(Prisma.sql`
      WITH student_course AS (
        SELECT ge."studentId",
               cs."courseId" AS "courseId",
               COALESCE(MAX(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionA",
               COALESCE(MAX(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionB",
               COALESCE(MAX(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionC",
               COALESCE(MAX(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionD"
        FROM "GradeEntry" ge
        JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
        JOIN "Assignment" a ON a."id" = ge."assignmentId"
        JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
        WHERE ge."studentId" = ${studentId} AND cs."academicTermId" = ${termId}
        GROUP BY ge."studentId", cs."courseId"
      )
      SELECT AVG("criterionA")::float AS "criterionA",
             AVG("criterionB")::float AS "criterionB",
             AVG("criterionC")::float AS "criterionC",
             AVG("criterionD")::float AS "criterionD"
      FROM student_course
    `);

  return {
    criterionA: Number(criterionA ?? 0),
    criterionB: Number(criterionB ?? 0),
    criterionC: Number(criterionC ?? 0),
    criterionD: Number(criterionD ?? 0),
  };
}

export async function getClassCriteriaSummary(
  classSectionId: string,
  termId: string
): Promise<CriteriaSummary> {
  const [{ criterionA, criterionB, criterionC, criterionD } = { criterionA: 0, criterionB: 0, criterionC: 0, criterionD: 0 }] =
    await prisma.$queryRaw<
      Array<{
        criterionA: number;
        criterionB: number;
        criterionC: number;
        criterionD: number;
      }>
    >(Prisma.sql`
      WITH student_course AS (
        SELECT ge."studentId",
               cs."courseId" AS "courseId",
               COALESCE(MAX(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionA",
               COALESCE(MAX(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionB",
               COALESCE(MAX(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionC",
               COALESCE(MAX(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionD"
        FROM "GradeEntry" ge
        JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
        JOIN "Assignment" a ON a."id" = ge."assignmentId"
        JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
        WHERE cs."id" = ${classSectionId} AND cs."academicTermId" = ${termId}
        GROUP BY ge."studentId", cs."courseId"
      )
      SELECT AVG("criterionA")::float AS "criterionA",
             AVG("criterionB")::float AS "criterionB",
             AVG("criterionC")::float AS "criterionC",
             AVG("criterionD")::float AS "criterionD"
      FROM student_course
    `);

  return {
    criterionA: Number(criterionA ?? 0),
    criterionB: Number(criterionB ?? 0),
    criterionC: Number(criterionC ?? 0),
    criterionD: Number(criterionD ?? 0),
  };
}

export async function getGradeCriteriaSummary(
  gradeLevel: number,
  termId: string
): Promise<CriteriaSummary> {
  const [{ criterionA, criterionB, criterionC, criterionD } = { criterionA: 0, criterionB: 0, criterionC: 0, criterionD: 0 }] =
    await prisma.$queryRaw<
      Array<{
        criterionA: number;
        criterionB: number;
        criterionC: number;
        criterionD: number;
      }>
    >(Prisma.sql`
      WITH student_course AS (
        SELECT ge."studentId",
               cs."courseId" AS "courseId",
               COALESCE(MAX(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionA",
               COALESCE(MAX(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionB",
               COALESCE(MAX(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionC",
               COALESCE(MAX(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END), 0)::int AS "criterionD"
        FROM "GradeEntry" ge
        JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
        JOIN "Assignment" a ON a."id" = ge."assignmentId"
        JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
        JOIN "Course" c ON c."id" = cs."courseId"
        JOIN "GradeLevel" gl ON gl."id" = c."gradeLevelId"
        WHERE gl."name" = ${String(gradeLevel)} AND cs."academicTermId" = ${termId}
        GROUP BY ge."studentId", cs."courseId"
      )
      SELECT AVG("criterionA")::float AS "criterionA",
             AVG("criterionB")::float AS "criterionB",
             AVG("criterionC")::float AS "criterionC",
             AVG("criterionD")::float AS "criterionD"
      FROM student_course
    `);

  return {
    criterionA: Number(criterionA ?? 0),
    criterionB: Number(criterionB ?? 0),
    criterionC: Number(criterionC ?? 0),
    criterionD: Number(criterionD ?? 0),
  };
}

export async function getStudentOverallStat(studentId: string, termId: string): Promise<OverallStat> {
  const [{ averageScore } = { averageScore: 0 }] = await prisma.$queryRaw<
    { averageScore: number }[]
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
      WHERE ge."studentId" = ${studentId} AND cs."academicTermId" = ${termId}
      GROUP BY ge."studentId", cs."courseId"
    )
    SELECT AVG(("criterionA" + "criterionB" + "criterionC" + "criterionD") / 4.0)::float AS "averageScore"
    FROM student_course
  `);

  const score = Number(averageScore ?? 0);
  return { averageScore: score, riskLevel: riskLevel(score) };
}

export async function getStudentTrimmedPercentileComposite(
  studentId: string,
  termId: string
): Promise<PercentileCompositeStat> {
  const rows = await prisma.$queryRaw<
    Array<{
      subjectId: string;
      percentile: number;
    }>
  >(Prisma.sql`
    WITH student_course AS (
      SELECT ge."studentId" AS "studentId",
             cs."courseId" AS "courseId",
             (
               COALESCE(MAX(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END), 0)::float
               + COALESCE(MAX(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END), 0)::float
               + COALESCE(MAX(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END), 0)::float
               + COALESCE(MAX(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END), 0)::float
             ) / 4.0 AS "score"
      FROM "GradeEntry" ge
      JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      WHERE cs."academicTermId" = ${termId}
      GROUP BY ge."studentId", cs."courseId"
    ),
    subject_percentiles AS (
      SELECT "studentId",
             "courseId",
             (CUME_DIST() OVER (PARTITION BY "courseId" ORDER BY "score")) * 100.0 AS "percentile"
      FROM student_course
    )
    SELECT "courseId" AS "subjectId",
           "percentile"::float AS "percentile"
    FROM subject_percentiles
    WHERE "studentId" = ${studentId}
  `);

  const percentiles = rows.map((row) => Number(row.percentile)).sort((left, right) => left - right);
  const trimmed = percentiles.length > 2 ? percentiles.slice(1, -1) : percentiles;

  return {
    composite: average(trimmed),
    subjectCount: percentiles.length,
    trimmedSubjectCount: trimmed.length,
  };
}

export async function getClassOverallStat(classSectionId: string, termId: string): Promise<OverallStat> {
  const [{ averageScore } = { averageScore: 0 }] = await prisma.$queryRaw<
    { averageScore: number }[]
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
    )
    SELECT AVG(("criterionA" + "criterionB" + "criterionC" + "criterionD") / 4.0)::float AS "averageScore"
    FROM student_course
  `);

  const score = Number(averageScore ?? 0);
  return { averageScore: score, riskLevel: riskLevel(score) };
}

export async function getGradeOverallStat(gradeLevel: number, termId: string): Promise<OverallStat> {
  const [{ averageScore } = { averageScore: 0 }] = await prisma.$queryRaw<
    { averageScore: number }[]
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
    )
    SELECT AVG(("criterionA" + "criterionB" + "criterionC" + "criterionD") / 4.0)::float AS "averageScore"
    FROM student_course
  `);

  const score = Number(averageScore ?? 0);
  return { averageScore: score, riskLevel: riskLevel(score) };
}
