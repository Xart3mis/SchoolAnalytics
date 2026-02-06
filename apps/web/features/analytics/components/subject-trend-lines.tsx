"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { FINAL_GRADE_SCALE } from "@/lib/analytics/config";
import type { SubjectTrendSeries } from "@/lib/analytics/trends";
import { chartTooltipProps } from "@/features/analytics/components/chart-tooltip";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

interface SubjectTrendLinesProps {
  data: SubjectTrendSeries[];
}

export function SubjectTrendLines({ data }: SubjectTrendLinesProps) {
  const chartData = buildChartData(data);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} />
          <XAxis
            dataKey="label"
            stroke="var(--text-muted)"
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[FINAL_GRADE_SCALE.min, FINAL_GRADE_SCALE.max]}
            stroke="var(--text-muted)"
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip {...chartTooltipProps} />
          {data.map((series, index) => (
            <Line
              key={series.subjectId}
              type="monotone"
              dataKey={series.subjectId}
              name={series.subjectName}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function buildChartData(data: SubjectTrendSeries[]) {
  if (data.length === 0) return [];
  const terms = data[0].points.map((point) => point.label);
  return terms.map((label, index) => {
    const row: Record<string, number | string> = { label };
    for (const series of data) {
      row[series.subjectId] = series.points[index]?.value ?? 0;
    }
    return row;
  });
}
