import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminNotes } from "@/features/notes/components/admin-notes";
import { StatTiles } from "@/features/analytics/components/stat-tiles";
import { getActiveTerm, getActiveTermForYear } from "@/lib/analytics/terms";
import { requireSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface GradesPageProps {
  searchParams?: Promise<{ q?: string; term?: string; year?: string }>;
}

export default async function GradesPage({ searchParams }: GradesPageProps) {
  await requireSession();
  const resolved = await searchParams;
  const query = resolved?.q ?? "";
  const termId = resolved?.term;
  const yearId = resolved?.year;

  let term = termId ? await getActiveTerm(termId) : null;
  if (!term && yearId) {
    term = await getActiveTermForYear(yearId);
  }
  if (!term) {
    term = await getActiveTerm();
  }
  if (!term) {
    return <div className="text-sm text-[color:var(--text-muted)]">No term data yet.</div>;
  }

  const grades = await prisma.$queryRaw<
    Array<{ gradeLevel: number; count: number }>
  >(Prisma.sql`
    SELECT gl."name"::int AS "gradeLevel",
           COUNT(DISTINCT ge."studentId")::int AS count
    FROM "GradeEntry" ge
    JOIN "Assignment" a ON a."id" = ge."assignmentId"
    JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
    JOIN "Course" c ON c."id" = cs."courseId"
    JOIN "GradeLevel" gl ON gl."id" = c."gradeLevelId"
    WHERE cs."academicTermId" = ${term.id}
    GROUP BY gl."name"
    ORDER BY gl."name"::int ASC
  `);
  const trimmedQuery = query.trim();
  const filteredGrades = trimmedQuery
    ? grades.filter((grade) => String(grade.gradeLevel).includes(trimmedQuery))
    : grades;

  return (
    <div className="flex flex-col gap-6">
      <StatTiles
        items={[
          { id: "grades", label: "Grade Levels", value: grades.length.toString() },
          { id: "term", label: "Active Term", value: `${term.name}` },
          { id: "year", label: "Academic Year", value: term.academicYear.name },
          {
            id: "students",
            label: "Students",
            value: grades.reduce((sum, g) => sum + g.count, 0).toLocaleString(),
          },
        ]}
      />

      <Card className="transition-transform duration-300 ease-out hover:-translate-y-0.5">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)] sm:text-sm">
            Grades
          </CardTitle>
          <form className="flex w-full items-center gap-2 sm:w-auto">
            {termId ? <input type="hidden" name="term" value={termId} /> : null}
            {yearId ? <input type="hidden" name="year" value={yearId} /> : null}
            <input
              name="q"
              defaultValue={query}
              placeholder="Filter grade..."
              className="h-8 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-xs text-[color:var(--text)] placeholder:text-[color:var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] sm:w-56"
            />
          </form>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[520px]">
              <div className="grid grid-cols-3 gap-4 border-b border-[color:var(--border)] pb-2 text-xs font-semibold uppercase text-[color:var(--text-muted)]">
                <div>Grade</div>
                <div>Students</div>
                <div>Action</div>
              </div>
              <div className="divide-y divide-[color:var(--border)]">
                {filteredGrades.map((grade) => (
                  <div
                    key={grade.gradeLevel}
                    className="grid grid-cols-3 gap-4 py-3 text-[13px] text-[color:var(--text)] sm:text-sm"
                  >
                    <div className="font-medium text-[color:var(--text)]">
                      Grade {grade.gradeLevel}
                    </div>
                    <div>{grade.count.toLocaleString()}</div>
                    <Link
                      href={`/grades/${grade.gradeLevel}?term=${term.id}`}
                      className="text-[13px] font-medium text-[color:var(--text)] hover:text-[color:var(--accent-3)] sm:text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
                {filteredGrades.length === 0 ? (
                  <div className="py-6 text-sm text-[color:var(--text-muted)]">
                    {grades.length === 0 ? "No grades found." : "No grades match the filter."}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AdminNotes pageKey="grades" />
    </div>
  );
}
