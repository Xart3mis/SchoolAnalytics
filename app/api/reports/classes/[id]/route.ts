import { NextResponse } from "next/server";

import { getSessionFromCookies } from "@/lib/auth/session";
import { weightedScoreSql } from "@/lib/analytics/sql";
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
  const classRecord = await prisma.class.findUnique({ where: { id } });
  if (!classRecord) {
    return NextResponse.json({ error: "Class not found." }, { status: 404 });
  }

  const term = await prisma.term.findFirst({ orderBy: { createdAt: "desc" } });
  if (!term) {
    return NextResponse.json({ error: "No term data." }, { status: 400 });
  }

  const scoreExpression = weightedScoreSql();
  const rows = await prisma.$queryRaw<
    Array<{ id: string; fullName: string; gradeLevel: number; avgScore: number }>
  >(Prisma.sql`
    SELECT s."id",
           s."fullName",
           s."gradeLevel",
           AVG(${scoreExpression})::float AS "avgScore"
    FROM "StudentSubjectTermScore" st
    JOIN "Student" s ON s."id" = st."studentId"
    WHERE st."classId" = ${id} AND st."termId" = ${term.id}
    GROUP BY s."id"
    ORDER BY "avgScore" ASC
  `);

  const header = toCsvRow(["Student ID", "Name", "Grade", "Average Score"]);
  const lines = rows.map((row) =>
    toCsvRow([row.id, row.fullName, row.gradeLevel, Number(row.avgScore).toFixed(2)])
  );

  const csv = [header, ...lines].join("\n");
  const filename = `class_${classRecord.name.replace(/\s+/g, "_")}_${term.trimester}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
