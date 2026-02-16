"use client";

import { Cell, Pie, PieChart, Tooltip } from "recharts";

import type { RiskBreakdown } from "@/lib/analytics/risk";
import { chartTooltipProps } from "@/features/analytics/components/chart-tooltip";
import { StableResponsiveContainer } from "@/features/analytics/components/stable-responsive-container";

const COLORS = ["var(--chart-4)", "var(--chart-2)", "var(--chart-1)"];

interface RiskBreakdownPieProps {
  data: RiskBreakdown[];
}

export function RiskBreakdownPie({ data }: RiskBreakdownPieProps) {
  return (
    <StableResponsiveContainer className="h-56 w-full">
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
    </StableResponsiveContainer>
  );
}
