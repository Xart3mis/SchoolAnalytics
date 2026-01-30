"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TrendPoint } from "@/lib/analytics/dashboard";

interface PerformanceAreaChartProps {
  data: TrendPoint[];
}

export function PerformanceAreaChart({ data }: PerformanceAreaChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="performanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#0f172a" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} />
          <YAxis
            domain={[1, 8]}
            stroke="#64748b"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderRadius: 8,
              border: "none",
              color: "#e2e8f0",
            }}
            formatter={(value: number) => [`${value.toFixed(2)}`, "Average Score"]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#38bdf8"
            strokeWidth={2}
            fill="url(#performanceFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
