"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemedSelect } from "@/components/ui/themed-select";
import type { ComparisonItem } from "@/lib/analytics/dashboard";

type ComparisonSection = {
  id: string;
  title: string;
  rows: ComparisonItem[];
};

interface EntityComparisonPanelsProps {
  sections: ComparisonSection[];
}

function Delta({ value }: { value: number }) {
  const sign = value > 0 ? "+" : "";
  const color =
    value > 0
      ? "text-[color:var(--risk-low-text)]"
      : value < 0
        ? "text-[color:var(--risk-high-text)]"
        : "text-[color:var(--text-muted)]";
  return <span className={`font-semibold ${color}`}>{`${sign}${value.toFixed(2)}`}</span>;
}

function ComparisonCard({ title, rows }: { title: string; rows: ComparisonItem[] }) {
  const [leftId, setLeftId] = React.useState(rows[0]?.id ?? "");
  const [rightId, setRightId] = React.useState(rows[1]?.id ?? rows[0]?.id ?? "");

  React.useEffect(() => {
    if (rows.length === 0) {
      setLeftId("");
      setRightId("");
      return;
    }
    if (!rows.some((row) => row.id === leftId)) {
      setLeftId(rows[0].id);
    }
    if (!rows.some((row) => row.id === rightId)) {
      setRightId(rows[1]?.id ?? rows[0].id);
    }
  }, [leftId, rightId, rows]);

  const left = rows.find((row) => row.id === leftId) ?? rows[0];
  const right = rows.find((row) => row.id === rightId) ?? rows[1] ?? rows[0];

  return (
    <Card className="transition-transform duration-300 ease-out hover:-translate-y-0.5">
      <CardHeader>
        <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <div className="py-3 text-xs text-[color:var(--text-muted)]">No data yet.</div>
        ) : (
          <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <ThemedSelect
                value={left?.id ?? ""}
                onChange={(event) => setLeftId(event.target.value)}
              >
                {rows.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.label}
                  </option>
                ))}
              </ThemedSelect>
              <ThemedSelect
                value={right?.id ?? ""}
                onChange={(event) => setRightId(event.target.value)}
              >
                {rows.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.label}
                  </option>
                ))}
              </ThemedSelect>
            </div>
            {left && right ? (
              <>
                <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-2 border-b border-[color:var(--border)] pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--text-muted)]">
                  <div>Metric</div>
                  <div>{left.label}</div>
                  <div>{right.label}</div>
                </div>
                <div className="space-y-1 text-xs">
                  {[
                    ["Criterion A", left.criterionA, right.criterionA],
                    ["Criterion B", left.criterionB, right.criterionB],
                    ["Criterion C", left.criterionC, right.criterionC],
                    ["Criterion D", left.criterionD, right.criterionD],
                    ["Overall", left.averageScore, right.averageScore],
                  ].map(([label, leftValue, rightValue]) => (
                    <div
                      key={label as string}
                      className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-2 text-[color:var(--text)]"
                    >
                      <span>{label as string}</span>
                      <span className="font-semibold">{Number(leftValue).toFixed(2)}</span>
                      <span className="font-semibold">{Number(rightValue).toFixed(2)}</span>
                      <Delta value={Number(leftValue) - Number(rightValue)} />
                    </div>
                  ))}
                  <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-2 border-t border-[color:var(--border)] pt-2 text-[color:var(--text)]">
                    <span>Cohort Size</span>
                    <span className="font-semibold">{left.cohortSize}</span>
                    <span className="font-semibold">{right.cohortSize}</span>
                    <span className="text-[color:var(--text-muted)]">{left.cohortSize - right.cohortSize}</span>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function EntityComparisonPanels({ sections }: EntityComparisonPanelsProps) {
  return (
    <section className="stagger grid gap-3 sm:gap-4 xl:grid-cols-3">
      {sections.map((section) => (
        <ComparisonCard key={section.id} title={section.title} rows={section.rows} />
      ))}
    </section>
  );
}
