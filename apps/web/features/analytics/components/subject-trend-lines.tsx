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
import type { CriterionTrendPoint } from "@/lib/analytics/trends";
import { chartTooltipProps } from "@/features/analytics/components/chart-tooltip";

const SERIES = [
  { key: "criterionA", label: "Criterion A", color: "var(--chart-1)" },
  { key: "criterionB", label: "Criterion B", color: "var(--chart-2)" },
  { key: "criterionC", label: "Criterion C", color: "var(--chart-3)" },
  { key: "criterionD", label: "Criterion D", color: "var(--chart-4)" },
] as const;

interface SubjectTrendLinesProps {
  data: CriterionTrendPoint[];
}

export function SubjectTrendLines({ data }: SubjectTrendLinesProps) {
  const [criterion, setCriterion] = React.useState<"all" | "criterionA" | "criterionB" | "criterionC" | "criterionD">("all");
  const visibleSeries =
    criterion === "all" ? SERIES : SERIES.filter((series) => series.key === criterion);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCriterion("all")}
          className={`rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
            criterion === "all"
              ? "border-[color:var(--border)] bg-[color:var(--surface-strong)] text-[color:var(--text)]"
              : "border-[color:var(--border)] text-[color:var(--text-muted)]"
          }`}
        >
          All Criteria
        </button>
        {SERIES.map((series) => (
          <button
            key={series.key}
            type="button"
            onClick={() => setCriterion(series.key)}
            className={`rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
              criterion === series.key
                ? "border-[color:var(--border)] bg-[color:var(--surface-strong)] text-[color:var(--text)]"
                : "border-[color:var(--border)] text-[color:var(--text-muted)]"
            }`}
          >
            {series.label}
          </button>
        ))}
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
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
          {criterion === "all" ? <Legend /> : null}
          {visibleSeries.map((series) => (
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
    </div>
  );
}
