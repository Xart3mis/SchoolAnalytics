"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

import { ChartCard } from "@/features/analytics/components/chart-card";
import type { DistributionSlice } from "@/lib/analytics/dashboard";

interface ClassPerformancePoint {
  label: string;
  averageScore: number;
  students: number;
}

interface ClassesOverviewChartsProps {
  gradeDistribution: DistributionSlice[];
  topClassPerformance: ClassPerformancePoint[];
  year: string;
  term: string;
}

function ChartSkeleton() {
  return (
    <div
      className="h-64 w-full animate-pulse rounded-lg bg-[color:var(--surface-strong)]"
      aria-label="Loading chart"
      role="status"
    />
  );
}

const DemographicsPieChart = dynamic(
  () =>
    import("@/features/analytics/components/demographics-pie-chart").then(
      (mod) => mod.DemographicsPieChart
    ),
  { ssr: false, loading: ChartSkeleton }
);

const ClassPerformanceBarChart = dynamic(
  () =>
    import("@/features/analytics/components/class-performance-bar-chart").then(
      (mod) => mod.ClassPerformanceBarChart
    ),
  { ssr: false, loading: ChartSkeleton }
);

export function ClassesOverviewCharts({
  gradeDistribution,
  topClassPerformance,
  year,
  term,
}: ClassesOverviewChartsProps) {
  return (
    <section className="stagger grid gap-3 sm:gap-4 xl:grid-cols-[1fr_2fr]">
      <ChartCard
        title="Class Distribution"
        subtitle="By MYP level"
        exportContext={{
          entity: "Class",
          year,
          term,
          chartType: "Class Distribution",
        }}
        exportRows={gradeDistribution.map((row) => ({
          level: row.label,
          classes: row.value,
        }))}
      >
        <Suspense fallback={<ChartSkeleton />}>
          <DemographicsPieChart data={gradeDistribution} />
        </Suspense>
      </ChartCard>
      <ChartCard
        title="Top Class Performance"
        subtitle="Highest criterion averages"
        exportContext={{
          entity: "Class",
          year,
          term,
          chartType: "Class Performance",
        }}
        exportRows={topClassPerformance.map((row) => ({
          class: row.label,
          criterionAverage: row.averageScore,
          students: row.students,
        }))}
      >
        <Suspense fallback={<ChartSkeleton />}>
          <ClassPerformanceBarChart data={topClassPerformance} />
        </Suspense>
      </ChartCard>
    </section>
  );
}
