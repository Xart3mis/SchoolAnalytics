import { NextResponse } from "next/server";

import { getSessionFromCookies } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const years = await prisma.academicYear.findMany({
    orderBy: { startDate: "desc" },
    include: { terms: { orderBy: { startDate: "asc" } } },
  });

  return NextResponse.json({
    years: years.map((year) => ({
      id: year.id,
      name: year.name,
      terms: year.terms.map((term) => ({
        id: term.id,
        name: term.name,
        startDate: term.startDate,
        endDate: term.endDate,
      })),
    })),
  });
}
