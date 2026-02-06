"use client";

import * as React from "react";

import type { SubjectStat } from "@/lib/analytics/aggregates";

interface SubjectStatsTableProps {
  title: string;
  data: SubjectStat[];
}

export function SubjectStatsTable({ title, data }: SubjectStatsTableProps) {
  const [filter, setFilter] = React.useState("");
  const trimmedFilter = filter.trim().toLowerCase();
  const filteredData = trimmedFilter
    ? data.filter((row) => row.subjectName.toLowerCase().includes(trimmedFilter))
    : data;

  return (
    <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_14px_34px_-26px_rgba(28,36,48,0.28)] transition-transform duration-300 ease-out hover:-translate-y-0.5 dark:shadow-[0_18px_44px_-32px_rgba(0,0,0,0.55)] sm:rounded-2xl">
      <div className="flex flex-col gap-3 border-b border-[color:var(--border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">
          {title}
        </div>
        <input
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Filter subject"
          className="h-8 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-xs text-[color:var(--text)] placeholder:text-[color:var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] sm:w-56"
        />
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[820px]">
          <div className="grid grid-cols-7 gap-3 border-b border-[color:var(--border)] px-4 py-2 text-xs font-semibold uppercase text-[color:var(--text-muted)]">
            <div>Subject</div>
            <div>Crit A</div>
            <div>Crit B</div>
            <div>Crit C</div>
            <div>Crit D</div>
            <div>Avg Final Grade</div>
            <div>Assessments</div>
          </div>
          <div className="divide-y divide-[color:var(--border)]">
            {filteredData.length === 0 ? (
              <div className="px-4 py-6 text-sm text-[color:var(--text-muted)]">
                {data.length === 0 ? "No data yet." : "No subjects match the filter."}
              </div>
            ) : (
              filteredData.map((row) => (
                <div
                  key={row.subjectId}
                  className="grid grid-cols-7 gap-3 px-4 py-3 text-[13px] text-[color:var(--text)] sm:text-sm"
                >
                  <div className="font-medium text-[color:var(--text)]">
                    {row.subjectName}
                  </div>
                  <div>{row.criterionA.toFixed(1)}</div>
                  <div>{row.criterionB.toFixed(1)}</div>
                  <div>{row.criterionC.toFixed(1)}</div>
                  <div>{row.criterionD.toFixed(1)}</div>
                  <div>{row.averageScore.toFixed(2)}</div>
                  <div>{row.assessmentCount.toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
