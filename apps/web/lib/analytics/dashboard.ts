import { Prisma } from "@school-analytics/db/client";

import { RISK_THRESHOLDS } from "@/lib/analytics/config";
import { prisma } from "@/lib/prisma";

export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  delta?: string;
}

export interface CriterionTrendPoint {
  label: string;
  criterionA: number;
  criterionB: number;
  criterionC: number;
  criterionD: number;
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

export interface ComparisonItem {
  id: string;
  label: string;
  averageScore: number;
  criterionA: number;
  criterionB: number;
  criterionC: number;
  criterionD: number;
  cohortSize: number;
}

export interface DashboardData {
  kpis: KpiMetric[];
  performanceTrend: CriterionTrendPoint[];
  gradeDistribution: DistributionSlice[];
  atRisk: AtRiskStudent[];
  atRiskTotalCount: number;
  activeTermLabel: string;
  comparisons: {
    grades: ComparisonItem[];
    classes: ComparisonItem[];
    students: ComparisonItem[];
  };
}

function riskLevel(score: number) {
  if (score <= RISK_THRESHOLDS.high) return "High";
  if (score <= RISK_THRESHOLDS.medium) return "Medium";
  return "Low";
}

export async function getDashboardData({
  termId,
  atRiskPage = 1,
  atRiskPageSize = 20,
}: {
  termId?: string;
  atRiskPage?: number;
  atRiskPageSize?: number;
} = {}): Promise<DashboardData> {
  const resolvedAtRiskPage = Math.max(1, atRiskPage);
  const resolvedAtRiskPageSize = Math.max(1, atRiskPageSize);
  const atRiskOffset = (resolvedAtRiskPage - 1) * resolvedAtRiskPageSize;

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
      atRiskTotalCount: 0,
      activeTermLabel: "No term data",
      comparisons: {
        grades: [],
        classes: [],
        students: [],
      },
    };
  }

  const terms = await prisma.academicTerm.findMany({
    where: { academicYearId: activeTerm.academicYearId },
    orderBy: { startDate: "asc" },
  });

  const termIds = terms.map((term) => term.id);

  const termCriteriaRows = termIds.length
    ? await prisma.$queryRaw<
        Array<{
          termId: string;
          criterionA: number;
          criterionB: number;
          criterionC: number;
          criterionD: number;
        }>
      >(Prisma.sql`
        WITH student_course AS (
          SELECT ge."studentId",
                 cs."academicTermId" AS "termId",
                 cs."courseId" AS "courseId",
                 COALESCE(MAX(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionA",
                 COALESCE(MAX(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionB",
                 COALESCE(MAX(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionC",
                 COALESCE(MAX(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionD"
          FROM "GradeEntry" ge
          JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
          JOIN "Assignment" a ON a."id" = ge."assignmentId"
          JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
          WHERE cs."academicTermId" IN (${Prisma.join(termIds)})
          GROUP BY ge."studentId", cs."academicTermId", cs."courseId"
        )
        SELECT "termId",
               AVG("criterionA")::float AS "criterionA",
               AVG("criterionB")::float AS "criterionB",
               AVG("criterionC")::float AS "criterionC",
               AVG("criterionD")::float AS "criterionD"
        FROM student_course
        GROUP BY "termId"
      `)
    : [];

  const termCriteriaMap = new Map(
    termCriteriaRows.map((row) => [
      row.termId,
      {
        criterionA: Number(row.criterionA ?? 0),
        criterionB: Number(row.criterionB ?? 0),
        criterionC: Number(row.criterionC ?? 0),
        criterionD: Number(row.criterionD ?? 0),
      },
    ]),
  );

  const gradeGroups = await prisma.$queryRaw<
    Array<{ gradeLevel: number; count: number }>
  >(Prisma.sql`
    WITH student_course AS (
      SELECT ge."studentId",
             cs."courseId" AS "courseId"
      FROM "GradeEntry" ge
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      WHERE cs."academicTermId" = ${activeTerm.id}
      GROUP BY ge."studentId", cs."courseId"
    )
    SELECT gl."name"::int AS "gradeLevel",
           COUNT(DISTINCT student_course."studentId")::int AS count
    FROM student_course
    JOIN "Course" c ON c."id" = student_course."courseId"
    JOIN "GradeLevel" gl ON gl."id" = c."gradeLevelId"
    GROUP BY gl."name"
    ORDER BY gl."name"::int ASC
  `);

  const [
    { totalStudents, averageScore, highRiskCount } = {
      totalStudents: 0,
      averageScore: 0,
      highRiskCount: 0,
    },
  ] = await prisma.$queryRaw<
    { totalStudents: number; averageScore: number; highRiskCount: number }[]
  >(Prisma.sql`
      SELECT
        COUNT(*)::int AS "totalStudents",
        AVG(stats."criterionAvg")::float AS "averageScore",
        SUM(CASE WHEN stats."criterionAvg" <= ${RISK_THRESHOLDS.high} THEN 1 ELSE 0 END)::int AS "highRiskCount"
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
          WHERE cs."academicTermId" = ${activeTerm.id}
          GROUP BY ge."studentId", cs."courseId"
        )
        SELECT "studentId",
               AVG(("criterionA" + "criterionB" + "criterionC" + "criterionD") / 4.0)::float AS "criterionAvg"
        FROM student_course
        GROUP BY "studentId"
      ) AS stats
    `);

  const atRiskRows = await prisma.$queryRaw<
    Array<{
      totalCount: number;
      studentId: string | null;
      fullName: string | null;
      gradeLevel: number | null;
      avgScore: number | null;
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
      WHERE cs."academicTermId" = ${activeTerm.id}
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
    ),
    at_risk AS (
      SELECT s."id" AS "studentId",
             COALESCE(u."displayName", CONCAT_WS(' ', s."firstName", s."lastName"), u."email") AS "fullName",
             grade_levels."gradeLevel" AS "gradeLevel",
             student_stats."avgGrade"::float AS "avgScore"
      FROM student_stats
      JOIN grade_levels ON grade_levels."studentId" = student_stats."studentId"
      JOIN "Student" s ON s."id" = student_stats."studentId"
      JOIN "User" u ON u."id" = s."userId"
    )
    SELECT totals."totalCount"::int AS "totalCount",
           page."studentId",
           page."fullName",
           page."gradeLevel",
           page."avgScore"
    FROM (
      SELECT COUNT(*)::int AS "totalCount"
      FROM at_risk
    ) totals
    LEFT JOIN LATERAL (
      SELECT *
      FROM at_risk
      ORDER BY "avgScore" ASC
      LIMIT ${resolvedAtRiskPageSize}
      OFFSET ${atRiskOffset}
    ) page ON true
  `);
  const atRiskTotalCount = atRiskRows[0]?.totalCount ?? 0;

  const [gradeComparisons, classComparisons, studentComparisons] =
    await Promise.all([
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
        WHERE cs."academicTermId" = ${activeTerm.id}
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
      ORDER BY "averageScore" DESC, gl."name"::int ASC
    `),
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
               cs."id" AS "classId",
               cs."name" AS "className",
               COALESCE(MAX(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionA",
               COALESCE(MAX(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionB",
               COALESCE(MAX(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionC",
               COALESCE(MAX(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END), 0)::float AS "criterionD"
        FROM "GradeEntry" ge
        JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
        JOIN "Assignment" a ON a."id" = ge."assignmentId"
        JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
        WHERE cs."academicTermId" = ${activeTerm.id}
        GROUP BY ge."studentId", cs."id", cs."name"
      )
      SELECT "classId" AS id,
             "className" AS label,
             AVG("criterionA")::float AS "criterionA",
             AVG("criterionB")::float AS "criterionB",
             AVG("criterionC")::float AS "criterionC",
             AVG("criterionD")::float AS "criterionD",
             AVG(("criterionA" + "criterionB" + "criterionC" + "criterionD") / 4.0)::float AS "averageScore",
             COUNT(DISTINCT "studentId")::int AS "cohortSize"
      FROM student_course
      GROUP BY "classId", "className"
      ORDER BY "averageScore" DESC, "cohortSize" DESC
    `),
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
        WHERE cs."academicTermId" = ${activeTerm.id}
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
      )
      SELECT s."id" AS id,
             COALESCE(u."displayName", CONCAT_WS(' ', s."firstName", s."lastName"), u."email") AS label,
             student_stats."criterionA"::float AS "criterionA",
             student_stats."criterionB"::float AS "criterionB",
             student_stats."criterionC"::float AS "criterionC",
             student_stats."criterionD"::float AS "criterionD",
             student_stats."averageScore"::float AS "averageScore",
             1::int AS "cohortSize"
      FROM student_stats
      JOIN "Student" s ON s."id" = student_stats."studentId"
      JOIN "User" u ON u."id" = s."userId"
      ORDER BY student_stats."averageScore" DESC
    `),
    ]);

  return {
    kpis: [
      {
        id: "students",
        label: "Total Students",
        value: totalStudents.toLocaleString(),
      },
      {
        id: "criterion-score",
        label: "Average Criterion",
        value: Number(averageScore ?? 0).toFixed(2),
      },
      {
        id: "high-risk",
        label: "High Risk",
        value: Number(highRiskCount ?? 0).toLocaleString(),
      },
      {
        id: "term",
        label: "Snapshot Term",
        value: `${activeTerm.name}`,
      },
    ],
    performanceTrend: terms.map((term) => {
      const row = termCriteriaMap.get(term.id);
      return {
        label: term.name,
        criterionA: row?.criterionA ?? 0,
        criterionB: row?.criterionB ?? 0,
        criterionC: row?.criterionC ?? 0,
        criterionD: row?.criterionD ?? 0,
      };
    }),
    gradeDistribution: gradeGroups.map((group) => ({
      label: `Level ${group.gradeLevel}`,
      value: group.count,
    })),
    atRisk: atRiskRows
      .filter(
        (row) =>
          row.studentId &&
          row.fullName &&
          row.gradeLevel !== null &&
          row.avgScore !== null,
      )
      .map((row) => ({
        id: row.studentId as string,
        name: row.fullName as string,
        gradeLevel: `MYP ${row.gradeLevel}`,
        averageScore: Number(row.avgScore),
        riskLevel: riskLevel(Number(row.avgScore)),
      })),
    atRiskTotalCount,
    activeTermLabel: `${activeTerm.academicYear.name} ${activeTerm.name}`,
    comparisons: {
      grades: gradeComparisons.map((item) => ({
        id: item.id,
        label: item.label,
        averageScore: Number(item.averageScore),
        criterionA: Number(item.criterionA),
        criterionB: Number(item.criterionB),
        criterionC: Number(item.criterionC),
        criterionD: Number(item.criterionD),
        cohortSize: Number(item.cohortSize),
      })),
      classes: classComparisons.map((item) => ({
        id: item.id,
        label: item.label,
        averageScore: Number(item.averageScore),
        criterionA: Number(item.criterionA),
        criterionB: Number(item.criterionB),
        criterionC: Number(item.criterionC),
        criterionD: Number(item.criterionD),
        cohortSize: Number(item.cohortSize),
      })),
      students: studentComparisons.map((item) => ({
        id: item.id,
        label: item.label,
        averageScore: Number(item.averageScore),
        criterionA: Number(item.criterionA),
        criterionB: Number(item.criterionB),
        criterionC: Number(item.criterionC),
        criterionD: Number(item.criterionD),
        cohortSize: Number(item.cohortSize),
      })),
    },
  };
}
