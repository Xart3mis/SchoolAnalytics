import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminNotes } from "@/features/notes/components/admin-notes";
import { StatTiles } from "@/features/analytics/components/stat-tiles";
import { getActiveTerm } from "@/lib/analytics/terms";
import { getClassList } from "@/lib/analytics/lists";
import { requireSession } from "@/lib/auth/guards";

export default async function ClassesPage() {
  await requireSession();
  const term = await getActiveTerm();
  if (!term) {
    return <div className="text-sm text-slate-500">No term data yet.</div>;
  }

  const classes = await getClassList(term.academicYear);

  return (
    <div className="flex flex-col gap-6">
      <StatTiles
        items={[
          { id: "classes", label: "Classes", value: classes.length.toLocaleString() },
          { id: "term", label: "Active Term", value: `${term.trimester}` },
          { id: "year", label: "Academic Year", value: term.academicYear },
          { id: "grades", label: "Grade Bands", value: "9-12" },
        ]}
      />

      <Card className="transition-transform duration-300 ease-out hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-[0.25em] text-slate-500">
            Classes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-2 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800">
            <div>Class</div>
            <div>Grade</div>
            <div>Year</div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="grid grid-cols-3 gap-4 py-3 text-sm text-slate-600 dark:text-slate-200"
              >
                <Link
                  href={`/classes/${cls.id}`}
                  className="font-medium text-slate-900 hover:text-slate-700 dark:text-slate-100"
                >
                  {cls.name}
                </Link>
                <div>Grade {cls.gradeLevel}</div>
                <div>{cls.academicYear}</div>
              </div>
            ))}
            {classes.length === 0 ? (
              <div className="py-6 text-sm text-slate-500">No classes found.</div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <AdminNotes pageKey="classes" />
    </div>
  );
}
