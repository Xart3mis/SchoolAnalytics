"use client";

import Link from "next/link";

import type { AtRiskRow } from "@/lib/analytics/risk";

interface AtRiskMiniTableProps {
  title: string;
  data: AtRiskRow[];
  exportHref: string;
}

export function AtRiskMiniTable({ title, data, exportHref }: AtRiskMiniTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/90 transition-transform duration-300 ease-out hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:border-slate-800">
        <span>{title}</span>
        <Link
          href={exportHref}
          className="rounded-full border border-slate-200 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:border-slate-800 dark:text-slate-300"
        >
          Export CSV
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-3 border-b border-slate-200 px-4 py-2 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800">
        <div>Student</div>
        <div>Grade</div>
        <div>Avg</div>
        <div>Risk</div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {data.length === 0 ? (
          <div className="px-4 py-6 text-sm text-slate-500">No at-risk students.</div>
        ) : (
          data.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-4 gap-3 px-4 py-3 text-sm text-slate-600 dark:text-slate-200"
            >
              <Link
                href={`/students/${row.id}`}
                className="font-medium text-slate-900 hover:text-slate-700 dark:text-slate-100"
              >
                {row.fullName}
              </Link>
              <div>Grade {row.gradeLevel}</div>
              <div>{row.averageScore.toFixed(2)}</div>
              <div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    row.riskLevel === "High"
                      ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200"
                      : row.riskLevel === "Medium"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
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
  );
}
