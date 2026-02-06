import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AtRiskTable } from "@/features/analytics/components/at-risk-table";
import { DashboardCharts } from "@/features/analytics/components/dashboard-charts";
import { AdminNotes } from "@/features/notes/components/admin-notes";
import { getDashboardData } from "@/lib/analytics/dashboard";
import { getActiveTerm, getActiveTermForYear } from "@/lib/analytics/terms";
import { requireSession } from "@/lib/auth/guards";

interface DashboardPageProps {
  searchParams?: Promise<{
    page?: string;
    term?: string;
    year?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  await requireSession();
  const resolvedSearchParams = await searchParams;
  const termId = resolvedSearchParams?.term;
  const yearId = resolvedSearchParams?.year;
  let term = termId ? await getActiveTerm(termId) : null;
  if (!term && yearId) {
    term = await getActiveTermForYear(yearId);
  }
  const data = await getDashboardData(term?.id);
  const page = Number(resolvedSearchParams?.page ?? "1");
  const pageSize = 20;
  const start = (page - 1) * pageSize;
  const atRiskPage = data.atRisk.slice(start, start + pageSize);
  const queryParams = new URLSearchParams();
  if (term?.id) {
    queryParams.set("term", term.id);
  } else if (yearId) {
    queryParams.set("year", yearId);
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
      />

      <section>
        <AtRiskTable
          data={atRiskPage}
          page={page}
          pageSize={pageSize}
          totalCount={data.atRisk.length}
          queryString={queryParams.toString()}
          termId={term?.id}
        />
      </section>

      <AdminNotes pageKey="dashboard" />
    </div>
  );
}
