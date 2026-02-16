import { NextResponse } from "next/server";

import { getClassEntityList } from "@/lib/analytics/class-entities";
import { getSessionFromCookies } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

type SearchResponse = {
  students: Array<{ id: string; name: string; email: string }>;
  classes: Array<{ id: string; name: string; gradeLevel: string | null; academicYear: string | null }>;
};

const EMPTY_RESPONSE: SearchResponse = { students: [], classes: [] };

function formatStudentName(student: {
  firstName: string | null;
  lastName: string | null;
  user: { displayName: string | null; email: string };
}) {
  const fullName = [student.firstName, student.lastName].filter(Boolean).join(" ").trim();
  return (student.user.displayName ?? fullName) || student.user.email;
}

export async function GET(request: Request) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();
  if (query.length < 2) {
    return NextResponse.json(EMPTY_RESPONSE);
  }

  const rawLimit = Number(searchParams.get("limit") ?? "6");
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 10) : 6;
  const termId = searchParams.get("term") ?? undefined;

  const [students, sectionClasses, entityClasses] = await Promise.all([
    prisma.student.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
          { user: { displayName: { contains: query, mode: "insensitive" } } },
          { user: { email: { contains: query, mode: "insensitive" } } },
        ],
      },
      take: limit,
      include: { user: true },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    }),
    prisma.classSection.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { course: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      take: limit,
      include: {
        academicYear: true,
        course: { include: { gradeLevel: true } },
      },
      orderBy: [{ name: "asc" }],
    }),
    termId ? getClassEntityList(termId, { query }) : Promise.resolve([]),
  ]);

  const classes =
    termId && entityClasses.length > 0
      ? entityClasses.slice(0, limit).map((entity) => ({
          id: entity.id,
          name: entity.classLabel,
          gradeLevel: entity.gradeLevel ? String(entity.gradeLevel) : null,
          academicYear: entity.academicYear,
        }))
      : sectionClasses.map((cls) => ({
          id: cls.id,
          name: cls.name,
          gradeLevel: cls.course?.gradeLevel?.name ?? null,
          academicYear: cls.academicYear?.name ?? null,
        }));

  return NextResponse.json({
    students: students.map((student) => ({
      id: student.id,
      name: formatStudentName(student),
      email: student.user.email,
    })),
    classes,
  } satisfies SearchResponse);
}
