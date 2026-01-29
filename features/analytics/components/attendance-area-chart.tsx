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

import type { AttendancePoint } from "@/lib/mock-data";

interface AttendanceAreaChartProps {
  data: AttendancePoint[];
}

export function AttendanceAreaChart({ data }: AttendanceAreaChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#0f172a" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" stroke="#64748b" tickLine={false} axisLine={false} />
          <YAxis
            domain={[90, 100]}
            stroke="#64748b"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderRadius: 8,
              border: "none",
              color: "#e2e8f0",
            }}
            formatter={(value: number) => [`${value}%`, "Attendance"]}
          />
          <Area
            type="monotone"
            dataKey="attendanceRate"
            stroke="#38bdf8"
            strokeWidth={2}
            fill="url(#attendanceFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
