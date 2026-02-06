import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminNotes } from "@/features/notes/components/admin-notes";
import { StatTiles } from "@/features/analytics/components/stat-tiles";
import { getActiveTerm, getActiveTermForYear } from "@/lib/analytics/terms";
import { getStudentList } from "@/lib/analytics/lists";
import { requireSession } from "@/lib/auth/guards";

interface StudentsPageProps {
  searchParams?: Promise<{ page?: string; q?: string; term?: string; year?: string }>;
}

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
  await requireSession();
  const resolved = await searchParams;
  const page = Math.max(1, Number(resolved?.page ?? "1"));
  const query = resolved?.q ?? "";
  const pageSize = 25;
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

  const { rows, total } = await getStudentList({
    termId: term.id,
    page,
    pageSize,
    query,
  });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex flex-col gap-6">
      <StatTiles
        items={[
          { id: "students", label: "Students", value: total.toLocaleString() },
          { id: "term", label: "Active Term", value: `${term.name}` },
          { id: "year", label: "Academic Year", value: term.academicYear.name },
          { id: "page", label: "Page", value: `${page} / ${totalPages}` },
        ]}
      />

      <Card className="transition-transform duration-300 ease-out hover:-translate-y-0.5">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)] sm:text-sm">
            Students Overview
          </CardTitle>
          <form className="flex w-full items-center gap-2 sm:w-auto">
            {termId ? <input type="hidden" name="term" value={termId} /> : null}
            {yearId ? <input type="hidden" name="year" value={yearId} /> : null}
            <input
              name="q"
              defaultValue={query}
              placeholder="Search student..."
              className="h-8 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-xs text-[color:var(--text)] placeholder:text-[color:var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] sm:w-56"
            />
          </form>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-4 gap-4 border-b border-[color:var(--border)] pb-2 text-xs font-semibold uppercase text-[color:var(--text-muted)]">
                <div>Student</div>
                <div>Grade</div>
                <div>Avg Final Grade</div>
                <div>Risk</div>
              </div>
              <div className="divide-y divide-[color:var(--border)]">
                {rows.map((student) => (
                  <div
                    key={student.id}
                    className="grid grid-cols-4 gap-4 py-3 text-[13px] text-[color:var(--text)] sm:text-sm"
                  >
                    <Link
                      href={`/students/${student.id}?term=${term.id}`}
                      className="font-medium text-[color:var(--text)] hover:text-[color:var(--accent-3)]"
                    >
                      {student.fullName}
                    </Link>
                    <div>Grade {student.gradeLevel}</div>
                    <div>{student.averageScore.toFixed(2)}</div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
                          student.riskLevel === "High"
                            ? "bg-[color:var(--risk-high-bg)] text-[color:var(--risk-high-text)]"
                            : student.riskLevel === "Medium"
                              ? "bg-[color:var(--risk-medium-bg)] text-[color:var(--risk-medium-text)]"
                              : "bg-[color:var(--risk-low-bg)] text-[color:var(--risk-low-text)]"
                        }`}
                      >
                        {student.riskLevel}
                      </span>
                    </div>
                  </div>
                ))}
                {rows.length === 0 ? (
                  <div className="py-6 text-sm text-[color:var(--text-muted)]">No students found.</div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 text-xs text-[color:var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              {page > 1 ? (
                <Link
                  href={`/students?page=${page - 1}&q=${encodeURIComponent(query)}&term=${term.id}`}
                  className="rounded-md border border-[color:var(--border)] px-3 py-1 text-xs text-[color:var(--text)] hover:bg-[color:var(--surface-strong)]"
                >
                  Previous
                </Link>
              ) : (
                <span className="rounded-md border border-[color:var(--border)] px-3 py-1 text-xs text-[color:var(--text-muted)]">
                  Previous
                </span>
              )}
              {page < totalPages ? (
                <Link
                  href={`/students?page=${page + 1}&q=${encodeURIComponent(query)}&term=${term.id}`}
                  className="rounded-md border border-[color:var(--border)] px-3 py-1 text-xs text-[color:var(--text)] hover:bg-[color:var(--surface-strong)]"
                >
                  Next
                </Link>
              ) : (
                <span className="rounded-md border border-[color:var(--border)] px-3 py-1 text-xs text-[color:var(--text-muted)]">
                  Next
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AdminNotes pageKey="students" />
    </div>
  );
}
