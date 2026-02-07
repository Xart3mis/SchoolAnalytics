"use client";

import * as React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CRITERION_SCORE_SCALE } from "@/lib/analytics/config";
import type { CriterionTrendPoint } from "@/lib/analytics/dashboard";
import { chartTooltipProps } from "@/features/analytics/components/chart-tooltip";

interface PerformanceAreaChartProps {
  data: CriterionTrendPoint[];
}

const SERIES = [
  { key: "criterionA", label: "Criterion A", color: "var(--chart-1)" },
  { key: "criterionB", label: "Criterion B", color: "var(--chart-2)" },
  { key: "criterionC", label: "Criterion C", color: "var(--chart-3)" },
  { key: "criterionD", label: "Criterion D", color: "var(--chart-4)" },
] as const;

function PerformanceAreaChartComponent({ data }: PerformanceAreaChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <LineChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} />
          <XAxis
            dataKey="label"
            stroke="var(--text-muted)"
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
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
            formatter={(value?: number, name?: string) => [`${(value ?? 0).toFixed(2)}`, name ?? "Criterion"]}
          />
          <Legend />
          {SERIES.map((series) => (
            <Line
              key={series.key}
              type="monotone"
              dataKey={series.key}
              name={series.label}
              stroke={series.color}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export const PerformanceAreaChart = React.memo(
  PerformanceAreaChartComponent,
  (prev, next) =>
    prev.data.length === next.data.length &&
    prev.data.every((point, index) => {
      const nextPoint = next.data[index];
      return (
        point.label === nextPoint?.label &&
        point.criterionA === nextPoint?.criterionA &&
        point.criterionB === nextPoint?.criterionB &&
        point.criterionC === nextPoint?.criterionC &&
        point.criterionD === nextPoint?.criterionD
      );
    })
);
