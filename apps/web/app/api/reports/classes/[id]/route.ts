import { NextResponse } from "next/server";

import { getClassEntityDetail } from "@/lib/analytics/class-entities";
import { getSessionFromCookies } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

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
  const url = new URL(request.url);
  const requestedTermId = url.searchParams.get("term") ?? undefined;
  const requestedYearId = url.searchParams.get("year") ?? undefined;
  const term = requestedTermId
    ? await prisma.academicTerm.findUnique({ where: { id: requestedTermId } })
    : await prisma.academicTerm.findFirst({ orderBy: { startDate: "desc" } });
  if (!term) {
    return NextResponse.json({ error: "No term data." }, { status: 400 });
  }

  const detail = await getClassEntityDetail({
    routeId: id,
    termId: term.id,
    academicYearId: requestedYearId ?? term.academicYearId,
    atRiskLimit: 2000,
  });
  if (!detail) {
    return NextResponse.json({ error: "Class not found." }, { status: 404 });
  }

  const header = toCsvRow(["Student ID", "Name", "Level", "Criterion Average (0-8)"]);
  const lines = detail.atRisk.map((row) =>
    toCsvRow([row.id, row.fullName, row.gradeLevel, row.averageScore.toFixed(2)])
  );

  const csv = [header, ...lines].join("\n");
  const filename = `class_${detail.entity.classLabel.replace(/\s+/g, "_")}_${term.name}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
