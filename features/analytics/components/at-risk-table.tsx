"use client";

import * as React from "react";
import Image from "next/image";
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

import type { AtRiskStudent } from "@/lib/mock-data";

interface AtRiskTableProps {
  data: AtRiskStudent[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export function AtRiskTable({ data, page, pageSize, totalCount }: AtRiskTableProps) {
  const [nameFilter, setNameFilter] = React.useState("");
  const columns = React.useMemo<ColumnDef<AtRiskStudent>[]>(
    () => [
      {
        header: "Student",
        accessorKey: "name",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Image
              src={row.original.avatarUrl}
              alt={row.original.name}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full"
            />
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {row.original.name}
              </div>
              <div className="text-xs text-slate-500">{row.original.gradeLevel}</div>
            </div>
          </div>
        ),
      },
      {
        header: "GPA",
        accessorKey: "gpa",
        cell: ({ row }) => row.original.gpa.toFixed(2),
      },
      {
        header: "Attendance",
        accessorKey: "attendanceRate",
        cell: ({ row }) => `${row.original.attendanceRate}%`,
      },
      {
        header: "Risk",
        accessorKey: "riskLevel",
        cell: ({ row }) => (
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
              row.original.riskLevel === "High"
                ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200"
                : row.original.riskLevel === "Medium"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
            }`}
          >
            {row.original.riskLevel}
          </span>
        ),
      },
      {
        header: "Actions",
        cell: () => (
          <Button size="sm" variant="outline">
            Launch Plan
          </Button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters: [{ id: "name", value: nameFilter }],
    },
  });

  const parentRef = React.useRef<HTMLDivElement>(null);
  const rows = table.getRowModel().rows;
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 8,
  });
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="rounded-xl border border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          At-Risk Students
        </div>
        <input
          value={nameFilter}
          onChange={(event) => setNameFilter(event.target.value)}
          placeholder="Filter by name"
          className="h-8 w-48 rounded-md border border-slate-200 bg-white/80 px-3 text-xs text-slate-700 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200 dark:focus-visible:ring-slate-600"
        />
      </div>
      <div className="grid grid-cols-5 gap-4 border-b border-slate-200 px-4 py-2 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800">
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
      <div ref={parentRef} className="max-h-[360px] overflow-auto">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <div
                key={row.id}
                className="grid grid-cols-5 gap-4 border-b border-slate-100 px-4 py-3 text-sm text-slate-600 dark:border-slate-800/60 dark:text-slate-200"
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
      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-800">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          {canPrev ? (
            <Button asChild size="sm" variant="outline">
              <Link href={`/?page=${page - 1}`}>Previous</Link>
            </Button>
          ) : (
            <Button size="sm" variant="outline" disabled>
              Previous
            </Button>
          )}
          {canNext ? (
            <Button asChild size="sm" variant="outline">
              <Link href={`/?page=${page + 1}`}>Next</Link>
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
