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

import type { SubjectTrendSeries } from "@/lib/analytics/trends";

const COLORS = ["#38bdf8", "#818cf8", "#f59e0b", "#34d399", "#f472b6"];

interface SubjectTrendLinesProps {
  data: SubjectTrendSeries[];
}

export function SubjectTrendLines({ data }: SubjectTrendLinesProps) {
  const chartData = buildChartData(data);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} />
          <YAxis domain={[1, 8]} stroke="#64748b" tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderRadius: 8,
              border: "none",
              color: "#e2e8f0",
            }}
          />
          {data.map((series, index) => (
            <Line
              key={series.subjectId}
              type="monotone"
              dataKey={series.subjectName}
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
      row[series.subjectName] = series.points[index]?.value ?? 0;
    }
    return row;
  });
}
