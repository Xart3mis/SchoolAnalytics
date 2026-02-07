import { NextResponse } from "next/server";

import { getSessionFromCookies } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@school-analytics/db/client";

function toCsvRow(values: Array<string | number>) {
  return values
    .map((value) => {
      const text = String(value ?? "");
      if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
        return `"${text.replace(/\"/g, "\"\"")}"`;
      }
      return text;
    })
    .join(",");
}

export async function GET(
  request: Request,
  context: { params: Promise<{ grade: string }> }
) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const { grade } = await context.params;
  const gradeLevel = Number(grade);
  if (Number.isNaN(gradeLevel)) {
    return NextResponse.json({ error: "Invalid grade." }, { status: 400 });
  }

  const term = await prisma.academicTerm.findFirst({ orderBy: { startDate: "desc" } });
  if (!term) {
    return NextResponse.json({ error: "No term data." }, { status: 400 });
  }

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
      WHERE gl."name" = ${String(gradeLevel)} AND cs."academicTermId" = ${term.id}
      GROUP BY ge."studentId", cs."courseId"
    ),
    student_stats AS (
      SELECT "studentId", AVG(("criterionA" + "criterionB" + "criterionC" + "criterionD") / 4.0)::float AS "avgGrade"
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
  `);

  const header = toCsvRow(["Student ID", "Name", "Level", "Criterion Average (0-8)"]);
  const lines = rows.map((row) =>
    toCsvRow([row.id, row.fullName, row.gradeLevel, Number(row.avgScore).toFixed(2)])
  );

  const csv = [header, ...lines].join("\n");
  const filename = `grade_${gradeLevel}_${term.name}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
