"use client";

import * as React from "react";
import Link from "next/link";

import type { AtRiskRow } from "@/lib/analytics/risk";

interface AtRiskMiniTableProps {
  title: string;
  data: AtRiskRow[];
  exportHref: string;
  yearId?: string;
}

export function AtRiskMiniTable({ title, data, exportHref, yearId }: AtRiskMiniTableProps) {
  const [filter, setFilter] = React.useState("");
  const trimmedFilter = filter.trim().toLowerCase();
  const filteredData = trimmedFilter
    ? data.filter((row) => row.fullName.toLowerCase().includes(trimmedFilter))
    : data;

  return (
    <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_14px_34px_-26px_rgba(28,36,48,0.3)] transition-transform duration-300 ease-out hover:-translate-y-0.5 dark:shadow-[0_18px_44px_-32px_rgba(0,0,0,0.55)] sm:rounded-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[color:var(--border)] px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">
          {title}
        </span>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <input
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Filter name"
            className="h-8 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-xs text-[color:var(--text)] placeholder:text-[color:var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] sm:w-40"
          />
          <Link
            href={exportHref}
            className="rounded-full border border-[color:var(--border)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--accent)]"
          >
            Export CSV
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
          <div className="grid grid-cols-4 gap-3 border-b border-[color:var(--border)] px-4 py-2 text-xs font-semibold uppercase text-[color:var(--text-muted)]">
            <div>Student</div>
            <div>Level</div>
            <div>Criterion Avg</div>
            <div>Risk</div>
          </div>
          <div className="divide-y divide-[color:var(--border)]">
            {filteredData.length === 0 ? (
              <div className="px-4 py-6 text-sm text-[color:var(--text-muted)]">No at-risk students.</div>
            ) : (
              filteredData.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-4 gap-3 px-4 py-3 text-[13px] text-[color:var(--text)] sm:text-sm"
                >
                  <Link
                    href={`/students/${row.id}${yearId ? `?year=${yearId}` : ""}`}
                    className="font-medium text-[color:var(--text)] hover:text-[color:var(--accent-3)]"
                  >
                    {row.fullName}
                  </Link>
                  <div>Level {row.gradeLevel}</div>
                  <div>{row.averageScore.toFixed(2)}</div>
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
                        row.riskLevel === "High"
                          ? "bg-[color:var(--risk-high-bg)] text-[color:var(--risk-high-text)]"
                          : row.riskLevel === "Medium"
                            ? "bg-[color:var(--risk-medium-bg)] text-[color:var(--risk-medium-text)]"
                            : "bg-[color:var(--risk-low-bg)] text-[color:var(--risk-low-text)]"
                      }`}
                    >
                      {row.riskLevel}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
