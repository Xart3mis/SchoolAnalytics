"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

import { ChartCard } from "@/features/analytics/components/chart-card";
import type { DistributionSlice, TrendPoint } from "@/lib/analytics/dashboard";

const PerformanceAreaChart = dynamic(
  () =>
    import("@/features/analytics/components/attendance-area-chart").then(
      (mod) => mod.PerformanceAreaChart
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

interface DashboardChartsProps {
  performanceTrend: TrendPoint[];
  gradeDistribution: DistributionSlice[];
}

export function DashboardCharts({
  performanceTrend,
  gradeDistribution,
}: DashboardChartsProps) {
  return (
    <section className="stagger grid gap-3 sm:gap-4 xl:grid-cols-[2fr_1fr]">
      <ChartCard title="Final Grade Trends" subtitle="Average final grade per term (1-7)">
        <Suspense fallback={<div className="h-64" />}>
          <PerformanceAreaChart data={performanceTrend} />
        </Suspense>
      </ChartCard>
      <ChartCard title="Student Distribution" subtitle="By grade">
        <Suspense fallback={<div className="h-64" />}>
          <DemographicsPieChart data={gradeDistribution} />
        </Suspense>
      </ChartCard>
    </section>
  );
}
