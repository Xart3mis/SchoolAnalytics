"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { chartTooltipProps } from "@/features/analytics/components/chart-tooltip";
import { StableResponsiveContainer } from "@/features/analytics/components/stable-responsive-container";
import { CRITERION_SCORE_SCALE } from "@/lib/analytics/config";

interface ClassPerformancePoint {
  label: string;
  averageScore: number;
}

interface ClassPerformanceBarChartProps {
  data: ClassPerformancePoint[];
}

export function ClassPerformanceBarChart({ data }: ClassPerformanceBarChartProps) {
  return (
    <StableResponsiveContainer className="h-72 w-full">
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 32 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} />
        <XAxis
          dataKey="label"
          stroke="var(--text-muted)"
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={60}
        />
        <YAxis
          domain={[CRITERION_SCORE_SCALE.min, CRITERION_SCORE_SCALE.max]}
          stroke="var(--text-muted)"
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          {...chartTooltipProps}
          formatter={(value?: number) => [`${(value ?? 0).toFixed(2)}`, "Criterion Avg"]}
        />
        <Bar dataKey="averageScore" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </StableResponsiveContainer>
  );
}
