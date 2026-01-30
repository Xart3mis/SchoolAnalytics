import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AtRiskTable } from "@/features/analytics/components/at-risk-table";
import { DashboardCharts } from "@/features/analytics/components/dashboard-charts";
import { AdminNotes } from "@/features/notes/components/admin-notes";
import { getDashboardData } from "@/lib/analytics/dashboard";
import { requireSession } from "@/lib/auth/guards";

interface DashboardPageProps {
  searchParams?: Promise<{
    page?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  await requireSession();
  const resolvedSearchParams = await searchParams;
  const data = await getDashboardData();
  const page = Number(resolvedSearchParams?.page ?? "1");
  const pageSize = 20;
  const start = (page - 1) * pageSize;
  const atRiskPage = data.atRisk.slice(start, start + pageSize);

  return (
    <div className="flex flex-col gap-6">
      <section className="stagger grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((kpi) => (
          <Card key={kpi.id} className="transition-transform duration-300 ease-out hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {kpi.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
                {kpi.value}
              </div>
              <div className="text-xs text-slate-500">{kpi.delta}</div>
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
        />
      </section>

      <AdminNotes pageKey="dashboard" />
    </div>
  );
}
