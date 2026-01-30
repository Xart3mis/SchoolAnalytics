import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminNotes } from "@/features/notes/components/admin-notes";
import { StatTiles } from "@/features/analytics/components/stat-tiles";
import { getActiveTerm } from "@/lib/analytics/terms";
import { getStudentList } from "@/lib/analytics/lists";
import { requireSession } from "@/lib/auth/guards";

interface StudentsPageProps {
  searchParams?: Promise<{ page?: string; q?: string }>;
}

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
  await requireSession();
  const resolved = await searchParams;
  const page = Math.max(1, Number(resolved?.page ?? "1"));
  const query = resolved?.q ?? "";
  const pageSize = 25;

  const term = await getActiveTerm();
  if (!term) {
    return <div className="text-sm text-slate-500">No term data yet.</div>;
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
          { id: "term", label: "Active Term", value: `${term.trimester}` },
          { id: "year", label: "Academic Year", value: term.academicYear },
          { id: "page", label: "Page", value: `${page} / ${totalPages}` },
        ]}
      />

      <Card className="transition-transform duration-300 ease-out hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm uppercase tracking-[0.25em] text-slate-500">
            Students Overview
          </CardTitle>
          <form className="flex items-center gap-2">
            <input
              name="q"
              defaultValue={query}
              placeholder="Search student..."
              className="h-8 w-48 rounded-md border border-slate-200 bg-white/80 px-3 text-xs text-slate-700 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200 dark:focus-visible:ring-slate-600"
            />
          </form>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 border-b border-slate-200 pb-2 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800">
            <div>Student</div>
            <div>Grade</div>
            <div>Avg Score</div>
            <div>Risk</div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {rows.map((student) => (
              <div
                key={student.id}
                className="grid grid-cols-4 gap-4 py-3 text-sm text-slate-600 dark:text-slate-200"
              >
                <Link
                  href={`/students/${student.id}`}
                  className="font-medium text-slate-900 hover:text-slate-700 dark:text-slate-100"
                >
                  {student.fullName}
                </Link>
                <div>Grade {student.gradeLevel}</div>
                <div>{student.averageScore.toFixed(2)}</div>
                <div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      student.riskLevel === "High"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200"
                        : student.riskLevel === "Medium"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                    }`}
                  >
                    {student.riskLevel}
                  </span>
                </div>
              </div>
            ))}
            {rows.length === 0 ? (
              <div className="py-6 text-sm text-slate-500">No students found.</div>
            ) : null}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              {page > 1 ? (
                <Link
                  href={`/students?page=${page - 1}&q=${encodeURIComponent(query)}`}
                  className="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Previous
                </Link>
              ) : (
                <span className="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-400 dark:border-slate-800">
                  Previous
                </span>
              )}
              {page < totalPages ? (
                <Link
                  href={`/students?page=${page + 1}&q=${encodeURIComponent(query)}`}
                  className="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Next
                </Link>
              ) : (
                <span className="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-400 dark:border-slate-800">
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
