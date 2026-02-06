import { NextResponse } from "next/server";

import { getSessionFromCookies } from "@/lib/auth/session";
import { mypCriteriaTotalSql, mypFinalGradeSql } from "@/lib/analytics/sql";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const { id } = await context.params;
  const classRecord = await prisma.classSection.findUnique({
    where: { id },
    include: { academicTerm: true },
  });
  if (!classRecord) {
    return NextResponse.json({ error: "Class not found." }, { status: 404 });
  }

  const term =
    classRecord.academicTerm ??
    (await prisma.academicTerm.findFirst({ orderBy: { startDate: "desc" } }));
  if (!term) {
    return NextResponse.json({ error: "No term data." }, { status: 400 });
  }

  const totalExpression = mypCriteriaTotalSql();
  const finalGradeExpression = mypFinalGradeSql(totalExpression);
  const rows = await prisma.$queryRaw<
    Array<{ id: string; fullName: string; gradeLevel: number; avgScore: number }>
  >(Prisma.sql`
    WITH final_grades AS (
      SELECT ge."studentId",
             cs."courseId" AS "courseId",
             ${finalGradeExpression}::int AS "finalGrade"
      FROM "GradeEntry" ge
      JOIN "GradeEntryCriterion" gec ON gec."gradeEntryId" = ge."id"
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      WHERE cs."id" = ${id} AND cs."academicTermId" = ${term.id}
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
           student_stats."avgGrade"::float AS "avgScore"
    FROM student_stats
    JOIN grade_levels ON grade_levels."studentId" = student_stats."studentId"
    JOIN "Student" s ON s."id" = student_stats."studentId"
    JOIN "User" u ON u."id" = s."userId"
    ORDER BY "avgScore" ASC
  `);

  const header = toCsvRow(["Student ID", "Name", "Grade", "Average Final Grade"]);
  const lines = rows.map((row) =>
    toCsvRow([row.id, row.fullName, row.gradeLevel, Number(row.avgScore).toFixed(2)])
  );

  const csv = [header, ...lines].join("\n");
  const filename = `class_${classRecord.name.replace(/\s+/g, "_")}_${term.name}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
