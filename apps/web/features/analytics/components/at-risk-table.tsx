"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import type { AtRiskStudent } from "@/lib/analytics/dashboard";

interface AtRiskTableProps {
  data: AtRiskStudent[];
  page: number;
  pageSize: number;
  totalCount: number;
  queryString?: string;
  yearId?: string;
}

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timeout);
  }, [delayMs, value]);

  return debounced;
}

export function AtRiskTable({
  data,
  page,
  pageSize,
  totalCount,
  queryString,
  yearId,
}: AtRiskTableProps) {
  const [nameFilterInput, setNameFilterInput] = React.useState("");
  const debouncedNameFilter = useDebouncedValue(nameFilterInput, 300);
  const columnFilters = React.useMemo(
    () => (debouncedNameFilter ? [{ id: "name", value: debouncedNameFilter }] : []),
    [debouncedNameFilter]
  );
  const columns = React.useMemo<ColumnDef<AtRiskStudent>[]>(
    () => [
      {
        header: "Student",
        accessorKey: "name",
        cell: ({ row }) => (
          <div>
            <div className="text-sm font-semibold text-[color:var(--text)]">
              {row.original.name}
            </div>
            <div className="text-xs text-[color:var(--text-muted)]">{row.original.gradeLevel}</div>
          </div>
        ),
      },
      {
        header: "Criterion Avg",
        accessorKey: "averageScore",
        cell: ({ row }) => row.original.averageScore.toFixed(2),
      },
      {
        header: "Risk",
        accessorKey: "riskLevel",
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
              row.original.riskLevel === "High"
                ? "bg-[color:var(--risk-high-bg)] text-[color:var(--risk-high-text)]"
                : row.original.riskLevel === "Medium"
                  ? "bg-[color:var(--risk-medium-bg)] text-[color:var(--risk-medium-text)]"
                  : "bg-[color:var(--risk-low-bg)] text-[color:var(--risk-low-text)]"
            }`}
          >
            {row.original.riskLevel}
          </span>
        ),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <Button asChild size="sm" variant="outline">
            <Link href={`/students/${row.original.id}${yearId ? `?year=${yearId}` : ""}`}>
              View
            </Link>
          </Button>
        ),
      },
    ],
    [yearId]
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  const parentRef = React.useRef<HTMLDivElement>(null);
  const rows = table.getRowModel().rows;
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 8,
  });
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;
  const buildHref = React.useCallback(
    (targetPage: number) => {
      const params = new URLSearchParams(queryString ?? "");
      params.set("page", String(targetPage));
      const query = params.toString();
      return query ? `/?${query}` : "/";
    },
    [queryString]
  );
  const prevHref = buildHref(page - 1);
  const nextHref = buildHref(page + 1);

  return (
    <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_14px_34px_-26px_rgba(28,36,48,0.3)] transition-transform duration-300 ease-out hover:-translate-y-0.5 dark:shadow-[0_18px_44px_-32px_rgba(0,0,0,0.55)] sm:rounded-2xl">
      <div className="flex flex-col gap-3 border-b border-[color:var(--border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">
          At-Risk Students
        </div>
        <input
          value={nameFilterInput}
          onChange={(event) => setNameFilterInput(event.target.value)}
          placeholder="Filter by name"
          className="h-8 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-xs text-[color:var(--text)] placeholder:text-[color:var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] sm:w-52"
        />
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-4 gap-4 border-b border-[color:var(--border)] px-4 py-2 text-xs font-semibold uppercase text-[color:var(--text-muted)]">
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => (
                <div key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </div>
              ))
            )}
          </div>
          <div ref={parentRef} className="max-h-[320px] overflow-auto sm:max-h-[360px]">
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];
                if (!row) {
                  return null;
                }
                return (
                  <div
                    key={row.id}
                    className="grid grid-cols-4 gap-4 border-b border-[color:var(--border)] px-4 py-3 text-[13px] text-[color:var(--text)] sm:text-sm"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <div key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-[color:var(--border)] px-4 py-3 text-xs text-[color:var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          {canPrev ? (
            <Button asChild size="sm" variant="outline">
              <Link href={prevHref}>Previous</Link>
            </Button>
          ) : (
            <Button size="sm" variant="outline" disabled>
              Previous
            </Button>
          )}
          {canNext ? (
            <Button asChild size="sm" variant="outline">
              <Link href={nextHref}>Next</Link>
            </Button>
          ) : (
            <Button size="sm" variant="outline" disabled>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
