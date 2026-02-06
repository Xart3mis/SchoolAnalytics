"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { RiskBreakdown } from "@/lib/analytics/risk";
import { chartTooltipProps } from "@/features/analytics/components/chart-tooltip";

const COLORS = ["var(--chart-4)", "var(--chart-2)", "var(--chart-1)"];

interface RiskBreakdownPieProps {
  data: RiskBreakdown[];
}

export function RiskBreakdownPie({ data }: RiskBreakdownPieProps) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
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
          <Tooltip {...chartTooltipProps} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
