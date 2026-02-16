import Link from "next/link";

import type { StudentListRow } from "@/lib/analytics/lists";
import { getPaginationState } from "@/lib/pagination";

interface StudentsOverviewTableProps {
  rows: StudentListRow[];
  page: number;
  pageSize: number;
  totalCount: number;
  queryString?: string;
  basePath?: string;
  yearId?: string;
  termId?: string;
}

export function StudentsOverviewTable({
  rows,
  page,
  pageSize,
  totalCount,
  queryString,
  basePath = "/",
  yearId,
  termId,
}: StudentsOverviewTableProps) {
  const { totalPages, canPrev, canNext, prevHref, nextHref } = getPaginationState({
    page,
    pageSize,
    totalCount,
    queryString,
    basePath,
  });

  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-4 gap-4 border-b border-[color:var(--border)] pb-2 text-xs font-semibold uppercase text-[color:var(--text-muted)]">
            <div>Student</div>
            <div>Level</div>
            <div>Criterion Avg</div>
            <div>Risk</div>
          </div>
          <div className="divide-y divide-[color:var(--border)]">
            {rows.map((student) => (
              <div
                key={student.id}
                className="grid grid-cols-4 gap-4 py-3 text-[13px] text-[color:var(--text)] sm:text-sm"
              >
                <Link
                  href={`/students/${student.id}?${new URLSearchParams({
                    ...(yearId ? { year: yearId } : {}),
                    ...(termId ? { term: termId } : {}),
                  }).toString()}`}
                  className="font-medium text-[color:var(--text)] hover:text-[color:var(--accent-3)]"
                >
                  {student.fullName}
                </Link>
                <div>MYP {student.gradeLevel}</div>
                <div>{student.averageScore.toFixed(2)}</div>
                <div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
                      student.riskLevel === "High"
                        ? "bg-[color:var(--risk-high-bg)] text-[color:var(--risk-high-text)]"
                        : student.riskLevel === "Medium"
                          ? "bg-[color:var(--risk-medium-bg)] text-[color:var(--risk-medium-text)]"
                          : "bg-[color:var(--risk-low-bg)] text-[color:var(--risk-low-text)]"
                    }`}
                  >
                    {student.riskLevel}
                  </span>
                </div>
              </div>
            ))}
            {rows.length === 0 ? (
              <div className="py-6 text-sm text-[color:var(--text-muted)]">No students found.</div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 text-xs text-[color:var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          {canPrev ? (
            <Link
              href={prevHref}
              className="rounded-md border border-[color:var(--border)] px-3 py-1 text-xs text-[color:var(--text)] hover:bg-[color:var(--surface-strong)]"
            >
              Previous
            </Link>
          ) : (
            <span className="rounded-md border border-[color:var(--border)] px-3 py-1 text-xs text-[color:var(--text-muted)]">
              Previous
            </span>
          )}
          {canNext ? (
            <Link
              href={nextHref}
              className="rounded-md border border-[color:var(--border)] px-3 py-1 text-xs text-[color:var(--text)] hover:bg-[color:var(--surface-strong)]"
            >
              Next
            </Link>
          ) : (
            <span className="rounded-md border border-[color:var(--border)] px-3 py-1 text-xs text-[color:var(--text-muted)]">
              Next
            </span>
          )}
        </div>
      </div>
    </>
  );
}
