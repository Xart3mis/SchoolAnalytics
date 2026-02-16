import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCharts } from "@/features/analytics/components/dashboard-charts";
import { StudentsFilters } from "@/features/analytics/components/students-filters";
import { StudentsOverviewTable } from "@/features/analytics/components/students-overview-table";
// import { EntityComparisonPanels } from "@/features/analytics/components/entity-comparison-panels";
import { AdminNotes } from "@/features/notes/components/admin-notes";
import { getDashboardData } from "@/lib/analytics/dashboard";
import { getStudentList } from "@/lib/analytics/lists";
import { resolveSelectedTerm } from "@/lib/analytics/terms";
import { requireSession } from "@/lib/auth/guards";

interface DashboardPageProps {
  searchParams?: Promise<{
    page?: string;
    q?: string;
    grade?: string;
    term?: string;
    year?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  await requireSession();
  const resolvedSearchParams = await searchParams;
  const yearId = resolvedSearchParams?.year;
  const requestedPage = Math.max(1, Number(resolvedSearchParams?.page ?? "1"));
  const query = resolvedSearchParams?.q ?? "";
  const selectedGradeValue = resolvedSearchParams?.grade ? Number(resolvedSearchParams.grade) : undefined;
  const selectedGrade = Number.isFinite(selectedGradeValue) ? selectedGradeValue : undefined;
  const pageSize = 15;
  const term = await resolveSelectedTerm({
    yearId,
    termId: resolvedSearchParams?.term,
  });
  const data = await getDashboardData({
    termId: term?.id,
  });
  const initialStudents =
    term
      ? await getStudentList({
          termId: term.id,
          page: requestedPage,
          pageSize,
          query,
          gradeLevel: selectedGrade,
        })
      : { rows: [], total: 0 };
  const studentsTotalPages = Math.max(1, Math.ceil(initialStudents.total / pageSize));
  const studentsPage = Math.min(requestedPage, studentsTotalPages);
  const studentsData =
    term && studentsPage !== requestedPage
      ? await getStudentList({
          termId: term.id,
          page: studentsPage,
          pageSize,
          query,
          gradeLevel: selectedGrade,
        })
      : initialStudents;

  const queryParams = new URLSearchParams();
  if (yearId) {
    queryParams.set("year", yearId);
  } else if (term?.academicYearId) {
    queryParams.set("year", term.academicYearId);
  }
  if (resolvedSearchParams?.term) {
    queryParams.set("term", resolvedSearchParams.term);
  } else if (term?.id) {
    queryParams.set("term", term.id);
  }
  if (query) {
    queryParams.set("q", query);
  }
  if (selectedGrade) {
    queryParams.set("grade", String(selectedGrade));
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="stagger grid gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((kpi) => (
          <Card key={kpi.id} className="transition-transform duration-300 ease-out hover:-translate-y-0.5">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
                {kpi.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[clamp(1.6rem,3vw,2.6rem)] font-semibold text-[color:var(--text)]">
                {kpi.value}
              </div>
              <div className="text-xs text-[color:var(--text-muted)]">{kpi.delta}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <DashboardCharts
        performanceTrend={data.performanceTrend}
        gradeDistribution={data.gradeDistribution}
        year={term?.academicYear.name ?? "UnknownYear"}
        term={term?.name ?? "UnknownTerm"}
      />

      {/* <EntityComparisonPanels */}
      {/*   sections={[ */}
      {/*     { id: "grades", title: "Level vs Level", rows: data.comparisons.grades }, */}
      {/*     { id: "classes", title: "Class vs Class", rows: data.comparisons.classes }, */}
      {/*     { id: "students", title: "Student vs Student", rows: data.comparisons.students }, */}
      {/*   ]} */}
      {/* /> */}

      <section>
        <Card className="transition-transform duration-300 ease-out hover:-translate-y-0.5">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)] sm:text-sm">
              Students Overview
            </CardTitle>
            <StudentsFilters
              initialGrade={selectedGrade}
              yearId={yearId}
              termId={resolvedSearchParams?.term ?? term?.id}
            />
          </CardHeader>
          <CardContent>
            <StudentsOverviewTable
              rows={studentsData.rows}
              page={studentsPage}
              pageSize={pageSize}
              totalCount={studentsData.total}
              queryString={queryParams.toString()}
              basePath="/"
              yearId={yearId ?? term?.academicYearId}
              termId={resolvedSearchParams?.term ?? term?.id}
            />
          </CardContent>
        </Card>
      </section>

      <AdminNotes pageKey="dashboard" />
    </div>
  );
}
