"use client";

import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { FINAL_GRADE_SCALE } from "@/lib/analytics/config";
import type { AssignmentTrendPoint } from "@/lib/analytics/trends";
import { chartTooltipProps } from "@/features/analytics/components/chart-tooltip";
import { cn } from "@/lib/utils";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

interface TermTrendLineProps {
  data: AssignmentTrendPoint[];
}

export function TermTrendLine({ data }: TermTrendLineProps) {
  const subjects = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const point of data) {
      if (point.kind === "assignment" && point.subjectId) {
        map.set(point.subjectId, point.subjectName ?? "Untitled");
      }
    }
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  const subjectConfigs = React.useMemo(
    () =>
      subjects.map((subject, index) => ({
        ...subject,
        color: COLORS[index % COLORS.length],
        key: `subject_${index}`,
      })),
    [subjects]
  );

  const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>(() =>
    subjects.map((subject) => subject.id)
  );

  React.useEffect(() => {
    if (subjectConfigs.length === 0) {
      setSelectedSubjects([]);
      return;
    }
    setSelectedSubjects((prev) => {
      const prevSet = new Set(prev);
      const next = subjectConfigs
        .map((subject) => subject.id)
        .filter((id) => prevSet.has(id));
      return next.length === 0 ? subjectConfigs.map((subject) => subject.id) : next;
    });
  }, [subjectConfigs]);

  const selectedSet = React.useMemo(() => new Set(selectedSubjects), [selectedSubjects]);

  const filteredData = React.useMemo(
    () =>
      data.filter(
        (point) => point.kind !== "assignment" || selectedSet.has(point.subjectId ?? "")
      ),
    [data, selectedSet]
  );

  const subjectKeyMap = React.useMemo(
    () => new Map(subjectConfigs.map((subject) => [subject.id, subject.key])),
    [subjectConfigs]
  );

  const chartData = React.useMemo(() => {
    return filteredData.map((point) => {
      const row: Record<string, number | string | null> = {
        id: point.id,
        label: point.label,
        fullLabel: point.fullLabel,
        kind: point.kind,
      };
      if (point.kind === "assignment" && point.subjectId && point.value != null) {
        const key = subjectKeyMap.get(point.subjectId);
        if (key) row[key] = point.value;
      }
      return row;
    });
  }, [filteredData, subjectKeyMap]);

  const visibleSubjects = React.useMemo(
    () => subjectConfigs.filter((subject) => selectedSet.has(subject.id)),
    [subjectConfigs, selectedSet]
  );

  const pointMap = React.useMemo(
    () => new Map(filteredData.map((point) => [point.id, point])),
    [filteredData]
  );

  const tickRenderer = (props: {
    x?: number;
    y?: number;
    payload?: { value: string };
  }) => {
    const { x = 0, y = 0, payload } = props;
    const point = payload?.value ? pointMap.get(String(payload.value)) : undefined;
    if (!point) return null;
    const isTermMarker = point.kind !== "assignment";
    const fill = isTermMarker ? "var(--accent)" : "var(--text-muted)";
    const fontSize = isTermMarker ? 10 : 9;
    const rotate = isTermMarker ? 0 : -25;
    const label = point.label;

    return (
      <g transform={`translate(${x},${y + 16})`}>
        <text
          textAnchor={isTermMarker ? "middle" : "end"}
          fill={fill}
          fontSize={fontSize}
          transform={rotate ? `rotate(${rotate})` : undefined}
        >
          {label}
        </text>
      </g>
    );
  };

  return (
    <div className="h-72 w-full">
      {subjectConfigs.length > 0 ? (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
            Subjects
          </span>
          {subjectConfigs.map((subject) => {
            const isSelected = selectedSet.has(subject.id);
            return (
              <button
                key={subject.id}
                type="button"
                onClick={() => {
                  setSelectedSubjects((prev) => {
                    const next = new Set(prev);
                    if (next.has(subject.id)) {
                      if (next.size === 1) return prev;
                      next.delete(subject.id);
                    } else {
                      next.add(subject.id);
                    }
                    return Array.from(next);
                  });
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors",
                  isSelected
                    ? "border-transparent bg-[color:var(--surface-strong)] text-[color:var(--text)]"
                    : "border-[color:var(--border)] text-[color:var(--text-muted)] hover:bg-[color:var(--surface-strong)]"
                )}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: subject.color, opacity: isSelected ? 1 : 0.35 }}
                />
                {subject.name}
              </button>
            );
          })}
        </div>
      ) : null}
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 40 }}>
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
            domain={[FINAL_GRADE_SCALE.min, FINAL_GRADE_SCALE.max]}
            stroke="var(--text-muted)"
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            {...chartTooltipProps}
            labelFormatter={(label, payload) =>
              payload?.[0]?.payload?.fullLabel ?? String(label)
            }
            formatter={(value?: number, name?: string, item?: { payload?: { kind?: string } }) => {
              if (!item?.payload || item.payload.kind !== "assignment" || value == null) {
                return null;
              }
              return [`${Number(value).toFixed(2)}`, name ?? "Avg Final Grade"];
            }}
          />
          {visibleSubjects.map((subject) => (
            <Line
              key={subject.id}
              type="monotone"
              dataKey={subject.key}
              name={subject.name}
              stroke={subject.color}
              strokeWidth={2}
              connectNulls
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
