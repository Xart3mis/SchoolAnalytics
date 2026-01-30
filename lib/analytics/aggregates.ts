import { Prisma } from "@prisma/client";

import { RISK_THRESHOLDS } from "@/lib/analytics/config";
import { weightedScoreSql } from "@/lib/analytics/sql";
import { prisma } from "@/lib/prisma";

export type SubjectStat = {
  subjectId: string;
  subjectName: string;
  averageScore: number;
  averageA: number;
  averageB: number;
  averageC: number;
  averageD: number;
};

export type OverallStat = {
  averageScore: number;
  riskLevel: "High" | "Medium" | "Low";
};

function riskLevel(score: number) {
  if (score <= RISK_THRESHOLDS.high) return "High";
  if (score <= RISK_THRESHOLDS.medium) return "Medium";
  return "Low";
}

export async function getStudentSubjectStats(studentId: string, termId: string) {
  const scoreExpression = weightedScoreSql();
  const rows = await prisma.$queryRaw<
    Array<{
      subjectId: string;
      subjectName: string;
      averageScore: number;
      averageA: number;
      averageB: number;
      averageC: number;
      averageD: number;
    }>
  >(Prisma.sql`
    SELECT sub."id" AS "subjectId",
           sub."name" AS "subjectName",
           AVG(${scoreExpression})::float AS "averageScore",
           AVG("criterionA")::float AS "averageA",
           AVG("criterionB")::float AS "averageB",
           AVG("criterionC")::float AS "averageC",
           AVG("criterionD")::float AS "averageD"
    FROM "StudentSubjectTermScore" st
    JOIN "Subject" sub ON sub."id" = st."subjectId"
    WHERE st."studentId" = ${studentId} AND st."termId" = ${termId}
    GROUP BY sub."id"
    ORDER BY sub."name" ASC
  `);

  return rows;
}

export async function getClassSubjectStats(classId: string, termId: string) {
  const scoreExpression = weightedScoreSql();
  const rows = await prisma.$queryRaw<SubjectStat[]>(Prisma.sql`
    SELECT sub."id" AS "subjectId",
           sub."name" AS "subjectName",
           AVG(${scoreExpression})::float AS "averageScore",
           AVG("criterionA")::float AS "averageA",
           AVG("criterionB")::float AS "averageB",
           AVG("criterionC")::float AS "averageC",
           AVG("criterionD")::float AS "averageD"
    FROM "StudentSubjectTermScore" st
    JOIN "Subject" sub ON sub."id" = st."subjectId"
    WHERE st."classId" = ${classId} AND st."termId" = ${termId}
    GROUP BY sub."id"
    ORDER BY sub."name" ASC
  `);

  return rows;
}

export async function getGradeSubjectStats(gradeLevel: number, termId: string) {
  const scoreExpression = weightedScoreSql();
  const rows = await prisma.$queryRaw<SubjectStat[]>(Prisma.sql`
    SELECT sub."id" AS "subjectId",
           sub."name" AS "subjectName",
           AVG(${scoreExpression})::float AS "averageScore",
           AVG("criterionA")::float AS "averageA",
           AVG("criterionB")::float AS "averageB",
           AVG("criterionC")::float AS "averageC",
           AVG("criterionD")::float AS "averageD"
    FROM "StudentSubjectTermScore" st
    JOIN "Subject" sub ON sub."id" = st."subjectId"
    JOIN "Student" s ON s."id" = st."studentId"
    WHERE s."gradeLevel" = ${gradeLevel} AND st."termId" = ${termId}
    GROUP BY sub."id"
    ORDER BY sub."name" ASC
  `);

  return rows;
}

export async function getStudentOverallStat(studentId: string, termId: string): Promise<OverallStat> {
  const scoreExpression = weightedScoreSql();
  const [{ averageScore } = { averageScore: 0 }] = await prisma.$queryRaw<
    { averageScore: number }[]
  >(Prisma.sql`
    SELECT AVG(${scoreExpression})::float AS "averageScore"
    FROM "StudentSubjectTermScore"
    WHERE "studentId" = ${studentId} AND "termId" = ${termId}
  `);

  const score = Number(averageScore ?? 0);
  return { averageScore: score, riskLevel: riskLevel(score) };
}

export async function getClassOverallStat(classId: string, termId: string): Promise<OverallStat> {
  const scoreExpression = weightedScoreSql();
  const [{ averageScore } = { averageScore: 0 }] = await prisma.$queryRaw<
    { averageScore: number }[]
  >(Prisma.sql`
    SELECT AVG(${scoreExpression})::float AS "averageScore"
    FROM "StudentSubjectTermScore"
    WHERE "classId" = ${classId} AND "termId" = ${termId}
  `);

  const score = Number(averageScore ?? 0);
  return { averageScore: score, riskLevel: riskLevel(score) };
}

export async function getGradeOverallStat(gradeLevel: number, termId: string): Promise<OverallStat> {
  const scoreExpression = weightedScoreSql();
  const [{ averageScore } = { averageScore: 0 }] = await prisma.$queryRaw<
    { averageScore: number }[]
  >(Prisma.sql`
    SELECT AVG(${scoreExpression})::float AS "averageScore"
    FROM "StudentSubjectTermScore" st
    JOIN "Student" s ON s."id" = st."studentId"
    WHERE s."gradeLevel" = ${gradeLevel} AND st."termId" = ${termId}
  `);

  const score = Number(averageScore ?? 0);
  return { averageScore: score, riskLevel: riskLevel(score) };
}
