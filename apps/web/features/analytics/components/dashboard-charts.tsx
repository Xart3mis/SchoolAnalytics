"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

import { ChartCard } from "@/features/analytics/components/chart-card";
import type { CriterionTrendPoint, DistributionSlice } from "@/lib/analytics/dashboard";

function ChartSkeleton() {
  return (
    <div
      className="h-64 w-full animate-pulse rounded-lg bg-[color:var(--surface-strong)]"
      aria-label="Loading chart"
      role="status"
    />
  );
}

const PerformanceAreaChart = dynamic(
  () =>
    import("@/features/analytics/components/attendance-area-chart").then(
      (mod) => mod.PerformanceAreaChart
    ),
  { ssr: false, loading: ChartSkeleton }
);

const DemographicsPieChart = dynamic(
  () =>
    import("@/features/analytics/components/demographics-pie-chart").then(
      (mod) => mod.DemographicsPieChart
    ),
  { ssr: false, loading: ChartSkeleton }
);

interface DashboardChartsProps {
  performanceTrend: CriterionTrendPoint[];
  gradeDistribution: DistributionSlice[];
}

export function DashboardCharts({
  performanceTrend,
  gradeDistribution,
}: DashboardChartsProps) {
  return (
    <section className="stagger grid gap-3 sm:gap-4 xl:grid-cols-[2fr_1fr]">
      <ChartCard title="Criterion Trends" subtitle="Per-criterion progression by term (0-8)">
        <Suspense fallback={<ChartSkeleton />}>
          <PerformanceAreaChart data={performanceTrend} />
        </Suspense>
      </ChartCard>
      <ChartCard title="Student Distribution" subtitle="By level">
        <Suspense fallback={<ChartSkeleton />}>
          <DemographicsPieChart data={gradeDistribution} />
        </Suspense>
      </ChartCard>
    </section>
  );
}
