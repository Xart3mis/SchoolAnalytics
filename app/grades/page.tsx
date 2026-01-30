import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminNotes } from "@/features/notes/components/admin-notes";
import { StatTiles } from "@/features/analytics/components/stat-tiles";
import { getActiveTerm } from "@/lib/analytics/terms";
import { requireSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

export default async function GradesPage() {
  await requireSession();
  const term = await getActiveTerm();
  if (!term) {
    return <div className="text-sm text-slate-500">No term data yet.</div>;
  }

  const grades = await prisma.student.groupBy({
    by: ["gradeLevel"],
    _count: { _all: true },
    orderBy: { gradeLevel: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <StatTiles
        items={[
          { id: "grades", label: "Grade Levels", value: grades.length.toString() },
          { id: "term", label: "Active Term", value: `${term.trimester}` },
          { id: "year", label: "Academic Year", value: term.academicYear },
          { id: "students", label: "Students", value: grades.reduce((sum, g) => sum + g._count._all, 0).toLocaleString() },
        ]}
      />

      <Card className="transition-transform duration-300 ease-out hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-[0.25em] text-slate-500">
            Grades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-2 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800">
            <div>Grade</div>
            <div>Students</div>
            <div>Action</div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {grades.map((grade) => (
              <div
                key={grade.gradeLevel}
                className="grid grid-cols-3 gap-4 py-3 text-sm text-slate-600 dark:text-slate-200"
              >
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  Grade {grade.gradeLevel}
                </div>
                <div>{grade._count._all.toLocaleString()}</div>
                <Link
                  href={`/grades/${grade.gradeLevel}`}
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-200"
                >
                  View Details
                </Link>
              </div>
            ))}
            {grades.length === 0 ? (
              <div className="py-6 text-sm text-slate-500">No grades found.</div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <AdminNotes pageKey="grades" />
    </div>
  );
}
