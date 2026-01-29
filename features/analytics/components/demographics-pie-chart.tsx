"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { DemographicSlice } from "@/lib/mock-data";

const COLORS = ["#38bdf8", "#818cf8", "#f59e0b", "#34d399"];

interface DemographicsPieChartProps {
  data: DemographicSlice[];
}

export function DemographicsPieChart({ data }: DemographicsPieChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="group"
            innerRadius={70}
            outerRadius={95}
            paddingAngle={4}
          >
            {data.map((_, index) => (
              <Cell key={`slice-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderRadius: 8,
              border: "none",
              color: "#e2e8f0",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
