import dynamic from "next/dynamic";
import { Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCard } from "@/features/analytics/components/chart-card";
import { AtRiskTable } from "@/features/analytics/components/at-risk-table";
import { getMockDashboardData } from "@/lib/mock-data";

const AttendanceAreaChart = dynamic(
  () =>
    import("@/features/analytics/components/attendance-area-chart").then(
      (mod) => mod.AttendanceAreaChart
    ),
  { ssr: false }
);

const DemographicsPieChart = dynamic(
  () =>
    import("@/features/analytics/components/demographics-pie-chart").then(
      (mod) => mod.DemographicsPieChart
    ),
  { ssr: false }
);

interface DashboardPageProps {
  searchParams?: {
    page?: string;
  };
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  const data = getMockDashboardData();
  const page = Number(searchParams?.page ?? "1");
  const pageSize = 20;
  const start = (page - 1) * pageSize;
  const atRiskPage = data.atRisk.slice(start, start + pageSize);

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((kpi) => (
          <Card key={kpi.id}>
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

      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <ChartCard title="Attendance Trends" subtitle="Last 7 months">
          <Suspense fallback={<div className="h-64" />}> 
            <AttendanceAreaChart data={data.attendanceTrend} />
          </Suspense>
        </ChartCard>
        <ChartCard title="Student Demographics" subtitle="By grade">
          <Suspense fallback={<div className="h-64" />}>
            <DemographicsPieChart data={data.demographics} />
          </Suspense>
        </ChartCard>
      </section>

      <section>
        <AtRiskTable
          data={atRiskPage}
          page={page}
          pageSize={pageSize}
          totalCount={data.atRisk.length}
        />
      </section>
    </div>
  );
}
