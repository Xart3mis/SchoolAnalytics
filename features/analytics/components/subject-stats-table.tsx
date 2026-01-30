"use client";

import type { SubjectStat } from "@/lib/analytics/aggregates";

interface SubjectStatsTableProps {
  title: string;
  data: SubjectStat[];
}

export function SubjectStatsTable({ title, data }: SubjectStatsTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/90 transition-transform duration-300 ease-out hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-950/90">
      <div className="border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:border-slate-800">
        {title}
      </div>
      <div className="grid grid-cols-6 gap-3 border-b border-slate-200 px-4 py-2 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800">
        <div>Subject</div>
        <div>Avg</div>
        <div>A</div>
        <div>B</div>
        <div>C</div>
        <div>D</div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {data.length === 0 ? (
          <div className="px-4 py-6 text-sm text-slate-500">No data yet.</div>
        ) : (
          data.map((row) => (
            <div
              key={row.subjectId}
              className="grid grid-cols-6 gap-3 px-4 py-3 text-sm text-slate-600 dark:text-slate-200"
            >
              <div className="font-medium text-slate-900 dark:text-slate-100">
                {row.subjectName}
              </div>
              <div>{row.averageScore.toFixed(2)}</div>
              <div>{row.averageA.toFixed(2)}</div>
              <div>{row.averageB.toFixed(2)}</div>
              <div>{row.averageC.toFixed(2)}</div>
              <div>{row.averageD.toFixed(2)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
