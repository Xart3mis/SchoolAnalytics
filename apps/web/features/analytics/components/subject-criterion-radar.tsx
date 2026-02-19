"use client";

import * as React from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, Tooltip } from "recharts";

import { ThemedSelect } from "@/components/ui/themed-select";
import { chartTooltipProps } from "@/features/analytics/components/chart-tooltip";
import { StableResponsiveContainer } from "@/features/analytics/components/stable-responsive-container";
import { CRITERION_SCORE_SCALE } from "@/lib/analytics/config";

interface CriterionValues {
  criterionA: number;
  criterionB: number;
  criterionC: number;
  criterionD: number;
}

interface SubjectCriterionSnapshot extends CriterionValues {
  subjectId: string;
  subjectName: string;
}

interface SubjectCriterionRadarProps {
  averageValues: CriterionValues;
  subjects: SubjectCriterionSnapshot[];
}

const CRITERION_AXES = [
  { key: "criterionA", label: "Criterion A" },
  { key: "criterionB", label: "Criterion B" },
  { key: "criterionC", label: "Criterion C" },
  { key: "criterionD", label: "Criterion D" },
] as const;

type CriterionKey = (typeof CRITERION_AXES)[number]["key"];

export function SubjectCriterionRadar({ averageValues, subjects }: SubjectCriterionRadarProps) {
  const [selectedSubjectId, setSelectedSubjectId] = React.useState("average");

  const selectedSnapshot = React.useMemo(() => {
    if (selectedSubjectId === "average") {
      return {
        label: "Average",
        values: averageValues,
      };
    }

    const selected = subjects.find((subject) => subject.subjectId === selectedSubjectId);
    if (!selected) {
      return {
        label: "Average",
        values: averageValues,
      };
    }

    return {
      label: selected.subjectName,
      values: selected,
    };
  }, [averageValues, selectedSubjectId, subjects]);

  const chartData = React.useMemo(
    () =>
      CRITERION_AXES.map((axis) => ({
        criterion: axis.label,
        value: selectedSnapshot.values[axis.key as CriterionKey],
      })),
    [selectedSnapshot]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
          Subject Snapshot
        </span>
        <ThemedSelect
          value={selectedSubjectId}
          onChange={(event) => setSelectedSubjectId(event.target.value)}
          className="w-auto min-w-[11rem]"
        >
          <option value="average">Average</option>
          {subjects.map((subject) => (
            <option key={subject.subjectId} value={subject.subjectId}>
              {subject.subjectName}
            </option>
          ))}
        </ThemedSelect>
      </div>
      <StableResponsiveContainer className="h-72 w-full">
        <RadarChart data={chartData} margin={{ top: 8, right: 16, left: 16, bottom: 8 }}>
          <PolarGrid stroke="var(--border)" strokeOpacity={0.7} />
          <PolarAngleAxis
            dataKey="criterion"
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <PolarRadiusAxis
            domain={[CRITERION_SCORE_SCALE.min, CRITERION_SCORE_SCALE.max]}
            angle={90}
            tickCount={5}
            stroke="var(--border)"
            tick={{ fill: "var(--text-muted)", fontSize: 10 }}
            axisLine={false}
          />
          <Tooltip
            {...chartTooltipProps}
            formatter={(value?: number) => [Number(value ?? 0).toFixed(2), selectedSnapshot.label]}
          />
          <Radar
            dataKey="value"
            name={selectedSnapshot.label}
            stroke="var(--chart-1)"
            fill="var(--chart-1)"
            fillOpacity={0.28}
            strokeWidth={2}
          />
        </RadarChart>
      </StableResponsiveContainer>
    </div>
  );
}
