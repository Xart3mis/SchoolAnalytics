import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminNotes } from "@/features/notes/components/admin-notes";
import { StatTiles } from "@/features/analytics/components/stat-tiles";
import { resolveSelectedTerm } from "@/lib/analytics/terms";
import { requireSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@school-analytics/db/client";

interface GradesPageProps {
  searchParams?: Promise<{ q?: string; term?: string; year?: string }>;
}

export default async function GradesPage({ searchParams }: GradesPageProps) {
  await requireSession();
  const resolved = await searchParams;
  const query = resolved?.q ?? "";
  const yearId = resolved?.year;
  const term = await resolveSelectedTerm({
    yearId,
    termId: resolved?.term,
  });
  if (!term) {
    return <div className="text-sm text-[color:var(--text-muted)]">No term data yet.</div>;
  }

  const grades = await prisma.$queryRaw<
    Array<{
      gradeLevel: number;
      count: number;
      criterionA: number;
      criterionB: number;
      criterionC: number;
      criterionD: number;
      averageScore: number;
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
      WHERE cs."academicTermId" = ${term.id}
      GROUP BY ge."studentId", cs."courseId"
    )
    SELECT gl."name"::int AS "gradeLevel",
           COUNT(DISTINCT student_course."studentId")::int AS count,
           AVG(student_course."criterionA")::float AS "criterionA",
           AVG(student_course."criterionB")::float AS "criterionB",
           AVG(student_course."criterionC")::float AS "criterionC",
           AVG(student_course."criterionD")::float AS "criterionD",
           AVG((student_course."criterionA" + student_course."criterionB" + student_course."criterionC" + student_course."criterionD") / 4.0)::float AS "averageScore"
    FROM student_course
    JOIN "Course" c ON c."id" = student_course."courseId"
    JOIN "GradeLevel" gl ON gl."id" = c."gradeLevelId"
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
          { id: "year", label: "Academic Year", value: term.academicYear.name },
          { id: "term", label: "Snapshot Term", value: `${term.name}` },
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
            <div className="min-w-[700px]">
              <div className="grid grid-cols-4 gap-4 border-b border-[color:var(--border)] pb-2 text-xs font-semibold uppercase text-[color:var(--text-muted)]">
                <div>Grade</div>
                <div>Students</div>
                <div>Criterion Avg</div>
                <div>Action</div>
              </div>
              <div className="divide-y divide-[color:var(--border)]">
                {filteredGrades.map((grade) => (
                  <div
                    key={grade.gradeLevel}
                    className="grid grid-cols-4 gap-4 py-3 text-[13px] text-[color:var(--text)] sm:text-sm"
                  >
                    <div className="font-medium text-[color:var(--text)]">
                      Grade {grade.gradeLevel}
                    </div>
                    <div>{grade.count.toLocaleString()}</div>
                    <div>{Number(grade.averageScore).toFixed(2)}</div>
                    <Link
                      href={`/grades/${grade.gradeLevel}?year=${term.academicYearId}`}
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
