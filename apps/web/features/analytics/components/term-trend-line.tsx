"use client";

import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CRITERION_SCORE_SCALE } from "@/lib/analytics/config";
import type { AssignmentTrendPoint } from "@/lib/analytics/trends";
import { chartTooltipProps } from "@/features/analytics/components/chart-tooltip";
import { ThemedSelect } from "@/components/ui/themed-select";
import { StableResponsiveContainer } from "@/features/analytics/components/stable-responsive-container";

const SERIES = [
  { key: "criterionA", label: "Criterion A", color: "var(--chart-1)" },
  { key: "criterionB", label: "Criterion B", color: "var(--chart-2)" },
  { key: "criterionC", label: "Criterion C", color: "var(--chart-3)" },
  { key: "criterionD", label: "Criterion D", color: "var(--chart-4)" },
] as const;

interface TermTrendLineProps {
  data: AssignmentTrendPoint[];
}

export function TermTrendLine({ data }: TermTrendLineProps) {
  const subjects = React.useMemo(() => {
    const seen = new Map<string, string>();
    for (const point of data) {
      if (point.kind !== "assignment" || !point.subjectId || !point.subjectName) continue;
      seen.set(point.subjectId, point.subjectName);
    }
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  }, [data]);
  const [subjectFilter, setSubjectFilter] = React.useState<string>("all");
  const [visibleSeries, setVisibleSeries] = React.useState({
    criterionA: true,
    criterionB: true,
    criterionC: true,
    criterionD: true,
  });
  const pointMap = React.useMemo(() => new Map(data.map((point) => [point.id, point])), [data]);
  const filteredData = React.useMemo(
    () =>
      data.filter((point) => {
        if (point.kind !== "assignment" || subjectFilter === "all") return true;
        return point.subjectId === subjectFilter;
      }),
    [data, subjectFilter]
  );

  const tickRenderer = (props: {
    x?: number | string;
    y?: number | string;
    payload?: { value?: string | number };
  }) => {
    const { x = 0, y = 0, payload } = props;
    const xPos = typeof x === "number" ? x : Number(x) || 0;
    const yPos = typeof y === "number" ? y : Number(y) || 0;
    const point = payload?.value ? pointMap.get(String(payload.value)) : undefined;
    if (!point) return null;
    const isTermMarker = point.kind !== "assignment";
    const fill = isTermMarker ? "var(--accent)" : "var(--text-muted)";
    const fontSize = isTermMarker ? 10 : 9;
    const rotate = isTermMarker ? 0 : -25;

    return (
      <g transform={`translate(${xPos},${yPos + 16})`}>
        <text
          textAnchor={isTermMarker ? "middle" : "end"}
          fill={fill}
          fontSize={fontSize}
          transform={rotate ? `rotate(${rotate})` : undefined}
        >
          {point.label}
        </text>
      </g>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <ThemedSelect
          value={subjectFilter}
          onChange={(event) => setSubjectFilter(event.target.value)}
          className="w-auto"
        >
          <option value="all">All subjects</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </ThemedSelect>
        {SERIES.map((series) => (
          <button
            key={series.key}
            type="button"
            onClick={() =>
              setVisibleSeries((prev) => ({ ...prev, [series.key]: !prev[series.key] }))
            }
            className={`rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
              visibleSeries[series.key]
                ? "border-[color:var(--border)] bg-[color:var(--surface-strong)] text-[color:var(--text)]"
                : "border-[color:var(--border)] text-[color:var(--text-muted)]"
            }`}
          >
            {series.label}
          </button>
        ))}
      </div>
      <StableResponsiveContainer className="h-72 w-full">
        <LineChart data={filteredData} margin={{ top: 8, right: 16, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} />
          <XAxis
            dataKey="id"
            stroke="var(--text-muted)"
            tick={tickRenderer}
            interval={0}
            height={56}
            tickMargin={8}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
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
            labelFormatter={(label, payload) => payload?.[0]?.payload?.fullLabel ?? String(label)}
            formatter={(value?: number, name?: string, item?: { payload?: { kind?: string } }) => {
              if (!item?.payload || item.payload.kind !== "assignment" || value == null) {
                return null;
              }
              return [`${Number(value).toFixed(2)}`, name ?? "Criterion"];
            }}
          />
          {SERIES.filter((series) => visibleSeries[series.key]).map((series) => (
            <Line
              key={series.key}
              type="monotone"
              dataKey={series.key}
              name={series.label}
              stroke={series.color}
              strokeWidth={2}
              connectNulls
              dot={false}
            />
          ))}
        </LineChart>
      </StableResponsiveContainer>
    </div>
  );
}
