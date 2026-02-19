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

type AggregationMode = "raw" | "weekly" | "biweekly";
type CriterionSeriesKey = (typeof SERIES)[number]["key"];

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const WEEK_IN_MS = 7 * DAY_IN_MS;
const MAX_ASSIGNMENT_TICKS = 18;

interface TermTrendLineProps {
  data: AssignmentTrendPoint[];
}

function safeAverage(values: Array<number | null | undefined>) {
  const numeric = values.filter((value): value is number => value != null);
  if (numeric.length === 0) return null;
  return numeric.reduce((sum, value) => sum + value, 0) / numeric.length;
}

function parsePointDate(point: AssignmentTrendPoint) {
  if (!point.eventDate) return null;
  const parsed = new Date(point.eventDate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function startOfIsoWeek(date: Date) {
  const start = new Date(date);
  const day = start.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + diffToMonday);
  return start;
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function normalizeTooltipLabel(value: unknown) {
  if (typeof value !== "string") return "";
  const cleaned = value.replace(/^\s*undefined\s*/i, "").trim();
  return cleaned;
}

function aggregateTermAssignments(
  assignments: AssignmentTrendPoint[],
  mode: Exclude<AggregationMode, "raw">
) {
  if (assignments.length === 0) return [];

  const parsedDates = assignments.map(parsePointDate);
  const hasCompleteDates = parsedDates.every((date) => date !== null);
  const firstDate = hasCompleteDates ? (parsedDates[0] as Date) : null;
  const firstWeekStart = firstDate ? startOfIsoWeek(firstDate) : null;
  const weeksPerBucket = mode === "weekly" ? 1 : 2;
  const fallbackBucketSize = mode === "weekly" ? 6 : 12;

  const buckets = new Map<
    number,
    {
      criterionA: Array<number | null | undefined>;
      criterionB: Array<number | null | undefined>;
      criterionC: Array<number | null | undefined>;
      criterionD: Array<number | null | undefined>;
      startDate: Date | null;
      endDate: Date | null;
      termId?: string;
      termName?: string;
    }
  >();

  assignments.forEach((point, index) => {
    const pointDate = parsedDates[index];
    let bucketIndex = 0;
    if (firstWeekStart && pointDate) {
      const pointWeekStart = startOfIsoWeek(pointDate);
      const diffWeeks = Math.floor((pointWeekStart.getTime() - firstWeekStart.getTime()) / WEEK_IN_MS);
      bucketIndex = Math.floor(diffWeeks / weeksPerBucket);
    } else {
      bucketIndex = Math.floor(index / fallbackBucketSize);
    }

    const bucket =
      buckets.get(bucketIndex) ??
      {
        criterionA: [],
        criterionB: [],
        criterionC: [],
        criterionD: [],
        startDate: null,
        endDate: null,
        termId: point.termId,
        termName: point.termName,
      };

    bucket.criterionA.push(point.criterionA);
    bucket.criterionB.push(point.criterionB);
    bucket.criterionC.push(point.criterionC);
    bucket.criterionD.push(point.criterionD);

    if (pointDate) {
      if (!bucket.startDate || pointDate < bucket.startDate) bucket.startDate = pointDate;
      if (!bucket.endDate || pointDate > bucket.endDate) bucket.endDate = pointDate;
    }
    if (!bucket.termId && point.termId) bucket.termId = point.termId;
    if (!bucket.termName && point.termName) bucket.termName = point.termName;

    buckets.set(bucketIndex, bucket);
  });

  return Array.from(buckets.entries())
    .sort(([left], [right]) => left - right)
    .map(([bucketIndex, bucket]) => {
      const sequence = bucketIndex + 1;
      const compactPrefix = mode === "weekly" ? "W" : "B";
      const fullPrefix = mode === "weekly" ? "Week" : "Bi-week";
      const termLabel = bucket.termName ?? "Term";
      const dateRangeLabel =
        bucket.startDate && bucket.endDate
          ? ` (${formatShortDate(bucket.startDate)}-${formatShortDate(bucket.endDate)})`
          : "";

      return {
        id: `aggregate-${mode}-${bucket.termId ?? "term"}-${sequence}`,
        label: `${compactPrefix}${sequence}`,
        fullLabel: `${termLabel} ${fullPrefix} ${sequence}${dateRangeLabel}`,
        criterionA: safeAverage(bucket.criterionA),
        criterionB: safeAverage(bucket.criterionB),
        criterionC: safeAverage(bucket.criterionC),
        criterionD: safeAverage(bucket.criterionD),
        kind: "assignment" as const,
        termId: bucket.termId,
        termName: bucket.termName,
        eventDate: bucket.startDate?.toISOString(),
      } satisfies AssignmentTrendPoint;
    });
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
  const [aggregationMode, setAggregationMode] = React.useState<AggregationMode>("raw");
  const [visibleSeries, setVisibleSeries] = React.useState({
    criterionA: true,
    criterionB: true,
    criterionC: true,
    criterionD: true,
  });

  const filteredData = React.useMemo(
    () =>
      data.filter((point) => {
        if (point.kind !== "assignment" || subjectFilter === "all") return true;
        return point.subjectId === subjectFilter;
      }),
    [data, subjectFilter]
  );

  const renderedData = React.useMemo(() => {
    if (aggregationMode === "raw") {
      let sequence = 1;
      return filteredData.map((point) => {
        if (point.kind !== "assignment") return point;
        const compactLabel = `A${sequence}`;
        sequence += 1;
        return {
          ...point,
          label: compactLabel,
        };
      });
    }

    const points: AssignmentTrendPoint[] = [];
    const assignmentBuffer: AssignmentTrendPoint[] = [];
    const flushBuffer = () => {
      if (assignmentBuffer.length === 0) return;
      points.push(...aggregateTermAssignments(assignmentBuffer, aggregationMode));
      assignmentBuffer.length = 0;
    };

    for (const point of filteredData) {
      if (point.kind === "assignment") {
        assignmentBuffer.push(point);
        continue;
      }
      flushBuffer();
      points.push(point);
    }
    flushBuffer();

    return points;
  }, [aggregationMode, filteredData]);

  const pointMap = React.useMemo(() => new Map(renderedData.map((point) => [point.id, point])), [renderedData]);

  const visibleTickIds = React.useMemo(() => {
    const visible = new Set<string>();
    const termMarkerIndexes = renderedData
      .map((point, index) => ({ point, index }))
      .filter(({ point }) => point.kind !== "assignment")
      .map(({ index }) => index);
    const assignmentPoints = renderedData
      .map((point, index) => ({ point, index }))
      .filter(({ point }) => point.kind === "assignment");
    const assignmentIds = assignmentPoints.map(({ point }) => point.id);
    const assignmentStep = Math.max(1, Math.ceil(assignmentIds.length / MAX_ASSIGNMENT_TICKS));

    assignmentPoints.forEach(({ point, index }, listIndex) => {
      const nearestTermDistance = termMarkerIndexes.length
        ? Math.min(...termMarkerIndexes.map((termIndex) => Math.abs(termIndex - index)))
        : Number.POSITIVE_INFINITY;
      const isEdge = listIndex === 0 || listIndex === assignmentIds.length - 1;
      const isBoundaryAdjacent = nearestTermDistance <= 1;
      if ((isEdge || listIndex % assignmentStep === 0) && !isBoundaryAdjacent) {
        visible.add(point.id);
      }
    });

    renderedData.forEach((point) => {
      if (point.kind !== "assignment") visible.add(point.id);
    });

    return visible;
  }, [renderedData]);

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
    if (point.kind === "assignment" && !visibleTickIds.has(point.id)) return null;

    const isTermMarker = point.kind !== "assignment";
    const fill = isTermMarker ? "var(--accent)" : "var(--text-muted)";
    const fontSize = isTermMarker ? 10 : 9;

    const yOffset = isTermMarker ? 24 : 8;
    const fontWeight = isTermMarker ? 700 : 500;

    return (
      <g transform={`translate(${xPos},${yPos + yOffset})`}>
        <text textAnchor="middle" fill={fill} fontSize={fontSize} fontWeight={fontWeight}>
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
        <ThemedSelect
          value={aggregationMode}
          onChange={(event) => setAggregationMode(event.target.value as AggregationMode)}
          className="w-auto"
        >
          <option value="raw">Raw assignments</option>
          <option value="weekly">Weekly avg</option>
          <option value="biweekly">Bi-weekly avg</option>
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
        <LineChart data={renderedData} margin={{ top: 8, right: 16, left: 0, bottom: 28 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} />
          <XAxis
            dataKey="id"
            stroke="var(--text-muted)"
            tick={tickRenderer}
            interval={0}
            minTickGap={12}
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
            labelFormatter={(label, payload) => {
              const rawLabel = payload?.[0]?.payload?.fullLabel ?? String(label);
              const normalized = normalizeTooltipLabel(rawLabel);
              return normalized || String(label);
            }}
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
              dataKey={series.key as CriterionSeriesKey}
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
