import { AtRiskTable } from "@/features/analytics/components/at-risk-table";
import { AdminNotes } from "@/features/notes/components/admin-notes";
import { StatTiles } from "@/features/analytics/components/stat-tiles";
import { getDashboardData } from "@/lib/analytics/dashboard";
import { resolveSelectedTerm } from "@/lib/analytics/terms";
import { requireSession } from "@/lib/auth/guards";

interface StudentsPageProps {
  searchParams?: Promise<{ page?: string; term?: string; year?: string }>;
}

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
  await requireSession();
  const resolved = await searchParams;
  const requestedPage = Math.max(1, Number(resolved?.page ?? "1"));
  const pageSize = 20;
  const yearId = resolved?.year;
  const term = await resolveSelectedTerm({
    yearId,
    termId: resolved?.term,
  });
  if (!term) {
    return <div className="text-sm text-[color:var(--text-muted)]">No term data yet.</div>;
  }

  const initialData = await getDashboardData({
    termId: term.id,
    atRiskPage: requestedPage,
    atRiskPageSize: pageSize,
  });
  const totalPages = Math.max(1, Math.ceil(initialData.atRiskTotalCount / pageSize));
  const page = Math.min(requestedPage, totalPages);
  const data =
    page === requestedPage
      ? initialData
      : await getDashboardData({
          termId: term.id,
          atRiskPage: page,
          atRiskPageSize: pageSize,
        });

  const totalStudentsLabel = data.kpis.find((kpi) => kpi.id === "students")?.value ?? "0";
  const queryParams = new URLSearchParams();
  queryParams.set("year", term.academicYearId);
  queryParams.set("term", term.id);

  return (
    <div className="flex flex-col gap-6">
      <StatTiles
        items={[
          { id: "students", label: "Students", value: totalStudentsLabel },
          { id: "year", label: "Academic Year", value: term.academicYear.name },
          { id: "term", label: "Snapshot Term", value: `${term.name}` },
        ]}
      />

      <AtRiskTable
        data={data.atRisk}
        page={page}
        pageSize={pageSize}
        totalCount={data.atRiskTotalCount}
        queryString={queryParams.toString()}
        basePath="/students"
        yearId={term.academicYearId}
        termId={term.id}
      />

      <AdminNotes pageKey="students" />
    </div>
  );
}
