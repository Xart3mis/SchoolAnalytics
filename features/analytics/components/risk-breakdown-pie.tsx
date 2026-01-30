"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { RiskBreakdown } from "@/lib/analytics/risk";

const COLORS = ["#f87171", "#fbbf24", "#34d399"];

interface RiskBreakdownPieProps {
  data: RiskBreakdown[];
}

export function RiskBreakdownPie({ data }: RiskBreakdownPieProps) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={60}
            outerRadius={85}
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
