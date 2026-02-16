import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminNotes } from "@/features/notes/components/admin-notes";
import { ClassesOverviewCharts } from "@/features/analytics/components/classes-overview-charts";
import { StatTiles } from "@/features/analytics/components/stat-tiles";
import { resolveSelectedTerm } from "@/lib/analytics/terms";
import { getClassEntityList } from "@/lib/analytics/class-entities";
import { requireSession } from "@/lib/auth/guards";
import { ClassesFilters } from "@/features/analytics/components/classes-filters";

interface ClassesPageProps {
  searchParams?: Promise<{ q?: string; term?: string; year?: string; grade?: string }>;
}

export default async function ClassesPage({ searchParams }: ClassesPageProps) {
  await requireSession();
  const resolved = await searchParams;
  const query = resolved?.q ?? "";
  const yearId = resolved?.year;
  const term = await resolveSelectedTerm({
    yearId,
    termId: resolved?.term,
  });
  const selectedGradeValue = resolved?.grade ? Number(resolved.grade) : undefined;
  const selectedGrade = Number.isFinite(selectedGradeValue) ? selectedGradeValue : undefined;

  if (!term) {
    return <div className="text-sm text-[color:var(--text-muted)]">No term data yet.</div>;
  }

  const classes = await getClassEntityList(term.id, {
    query,
    gradeLevel: selectedGrade,
  });

  const gradeDistribution = Array.from(
    classes.reduce((map, row) => {
      const label = row.gradeLevel ? `MYP ${row.gradeLevel}` : "Unknown";
      map.set(label, (map.get(label) ?? 0) + 1);
      return map;
    }, new Map<string, number>())
  ).map(([label, value]) => ({ label, value }));

  const topClassPerformance = [...classes]
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 10)
    .map((row) => ({
      label: row.classLabel,
      averageScore: row.averageScore,
      students: row.studentCount,
    }));

  return (
    <div className="flex flex-col gap-6">
      <StatTiles
        items={[
          { id: "classes", label: "Classes", value: classes.length.toLocaleString() },
          { id: "year", label: "Academic Year", value: term.academicYear.name },
          { id: "term", label: "Snapshot Term", value: `${term.name}` },
          {
            id: "criterion",
            label: "Avg Criterion",
            value:
              classes.length > 0
                ? (
                  classes.reduce((sum, cls) => sum + cls.averageScore, 0) / classes.length
                ).toFixed(2)
                : "0.00",
          },
        ]}
      />

      <Card className="transition-transform duration-300 ease-out hover:-translate-y-0.5">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)] sm:text-sm">
            Classes
          </CardTitle>
          <ClassesFilters
            initialGrade={selectedGrade}
            yearId={yearId}
            termId={resolved?.term}
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-5 gap-4 border-b border-[color:var(--border)] pb-2 text-xs font-semibold uppercase text-[color:var(--text-muted)]">
                <div>Class</div>
                <div>Level</div>
                <div>Criterion Avg</div>
                <div>Students</div>
                <div>Subjects</div>
              </div>
              <div className="divide-y divide-[color:var(--border)]">
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="grid grid-cols-5 gap-4 py-3 text-[13px] text-[color:var(--text)] sm:text-sm"
                  >
                    <Link
                      href={`/classes/${cls.id}?year=${term.academicYearId}&term=${term.id}`}
                      className="font-medium text-[color:var(--text)] hover:text-[color:var(--accent-3)]"
                    >
                      {cls.classLabel}
                    </Link>
                    <div>{cls.gradeLevel ? `MYP ${cls.gradeLevel}` : "N/A"}</div>
                    <div>{cls.averageScore.toFixed(2)}</div>
                    <div>{cls.studentCount}</div>
                    <div>{cls.subjectCount}</div>
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

      <ClassesOverviewCharts
        gradeDistribution={gradeDistribution}
        topClassPerformance={topClassPerformance}
        year={term.academicYear.name}
        term={term.name}
      />

      <AdminNotes pageKey="classes" />
    </div>
  );
}
