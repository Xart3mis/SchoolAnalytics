"use client";

import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from "recharts";

import { CRITERION_SCORE_SCALE } from "@/lib/analytics/config";
import { chartTooltipProps } from "@/features/analytics/components/chart-tooltip";
import { StableResponsiveContainer } from "@/features/analytics/components/stable-responsive-container";

interface CriteriaComparisonBarsProps {
  values: {
    criterionA: number;
    criterionB: number;
    criterionC: number;
    criterionD: number;
  };
}

export function CriteriaComparisonBars({ values }: CriteriaComparisonBarsProps) {
  const data = [
    { label: "A", value: values.criterionA, color: "var(--chart-1)" },
    { label: "B", value: values.criterionB, color: "var(--chart-2)" },
    { label: "C", value: values.criterionC, color: "var(--chart-3)" },
    { label: "D", value: values.criterionD, color: "var(--chart-4)" },
  ];

  return (
    <StableResponsiveContainer className="h-56 w-full">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} />
        <XAxis
          dataKey="label"
          stroke="var(--text-muted)"
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[CRITERION_SCORE_SCALE.min, CRITERION_SCORE_SCALE.max]}
          stroke="var(--text-muted)"
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          {...chartTooltipProps}
          formatter={(value: number | string | undefined) => [
            `${Number(value ?? 0).toFixed(2)} / ${CRITERION_SCORE_SCALE.max}`,
            "Criterion",
          ]}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.label} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </StableResponsiveContainer>
  );
}
