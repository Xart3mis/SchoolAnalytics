import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminNotes } from "@/features/notes/components/admin-notes";
import { StatTiles } from "@/features/analytics/components/stat-tiles";
import { getActiveTerm, getActiveTermForYear } from "@/lib/analytics/terms";
import { getClassList } from "@/lib/analytics/lists";
import { requireSession } from "@/lib/auth/guards";

interface ClassesPageProps {
  searchParams?: Promise<{ q?: string; term?: string; year?: string }>;
}

export default async function ClassesPage({ searchParams }: ClassesPageProps) {
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

  const classes = await getClassList(term.id, query);

  return (
    <div className="flex flex-col gap-6">
      <StatTiles
        items={[
          { id: "classes", label: "Classes", value: classes.length.toLocaleString() },
          { id: "term", label: "Active Term", value: `${term.name}` },
          { id: "year", label: "Academic Year", value: term.academicYear.name },
          { id: "grades", label: "Grade Bands", value: "9-12" },
        ]}
      />

      <Card className="transition-transform duration-300 ease-out hover:-translate-y-0.5">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)] sm:text-sm">
            Classes
          </CardTitle>
          <form className="mt-3 flex w-full items-center gap-2 sm:mt-0 sm:w-auto">
            {termId ? <input type="hidden" name="term" value={termId} /> : null}
            {yearId ? <input type="hidden" name="year" value={yearId} /> : null}
            <input
              name="q"
              defaultValue={query}
              placeholder="Filter class..."
              className="h-8 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-xs text-[color:var(--text)] placeholder:text-[color:var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] sm:w-56"
            />
          </form>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[520px]">
              <div className="grid grid-cols-3 gap-4 border-b border-[color:var(--border)] pb-2 text-xs font-semibold uppercase text-[color:var(--text-muted)]">
                <div>Class</div>
                <div>Grade</div>
                <div>Year</div>
              </div>
              <div className="divide-y divide-[color:var(--border)]">
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="grid grid-cols-3 gap-4 py-3 text-[13px] text-[color:var(--text)] sm:text-sm"
                  >
                    <Link
                      href={`/classes/${cls.id}?term=${term.id}`}
                      className="font-medium text-[color:var(--text)] hover:text-[color:var(--accent-3)]"
                    >
                      {cls.name}
                    </Link>
                    <div>Grade {cls.gradeLevel}</div>
                    <div>{cls.academicYear}</div>
                  </div>
                ))}
                {classes.length === 0 ? (
                  <div className="py-6 text-sm text-[color:var(--text-muted)]">No classes found.</div>
                ) : null}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AdminNotes pageKey="classes" />
    </div>
  );
}
