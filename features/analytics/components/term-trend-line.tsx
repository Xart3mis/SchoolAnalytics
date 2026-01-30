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

import type { TermTrendPoint } from "@/lib/analytics/trends";

interface TermTrendLineProps {
  data: TermTrendPoint[];
}

export function TermTrendLine({ data }: TermTrendLineProps) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
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
            formatter={(value: number) => [`${value.toFixed(2)}`, "Avg Score"]}
          />
          <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
