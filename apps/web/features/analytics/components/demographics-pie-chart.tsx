"use client";

import { Cell, Pie, PieChart, Tooltip } from "recharts";

import type { DistributionSlice } from "@/lib/analytics/dashboard";
import { chartTooltipProps } from "@/features/analytics/components/chart-tooltip";
import { StableResponsiveContainer } from "@/features/analytics/components/stable-responsive-container";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-5)", "var(--chart-3)"];

interface DemographicsPieChartProps {
  data: DistributionSlice[];
}

export function DemographicsPieChart({ data }: DemographicsPieChartProps) {
  return (
    <StableResponsiveContainer className="h-64 w-full">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={70}
          outerRadius={95}
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
