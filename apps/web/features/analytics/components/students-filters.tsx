"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ThemedSelect } from "@/components/ui/themed-select";

interface StudentsFiltersProps {
  initialQuery: string;
  initialGrade?: number;
  yearId?: string;
  termId?: string;
}

export function StudentsFilters({ initialQuery, initialGrade, yearId, termId }: StudentsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = React.useState(initialQuery);
  const [grade, setGrade] = React.useState(initialGrade ? String(initialGrade) : "");

  const applyFilters = React.useCallback(
    (nextGrade: string, nextQuery: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      if (nextQuery.trim()) {
        params.set("q", nextQuery.trim());
      } else {
        params.delete("q");
      }
      if (nextGrade) {
        params.set("grade", nextGrade);
      } else {
        params.delete("grade");
      }
      if (yearId) params.set("year", yearId);
      if (termId) params.set("term", termId);
      const nextQueryString = params.toString();
      router.push(nextQueryString ? `${pathname}?${nextQueryString}` : pathname);
    },
    [pathname, router, searchParams, termId, yearId]
  );

  return (
    <form
      className="flex w-full items-center gap-2 sm:w-auto"
      onSubmit={(event) => {
        event.preventDefault();
        applyFilters(grade, query);
      }}
    >
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search student..."
        className="h-8 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-xs text-[color:var(--text)] placeholder:text-[color:var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] sm:w-56"
      />
      <ThemedSelect
        value={grade}
        onChange={(event) => {
          const nextGrade = event.target.value;
          setGrade(nextGrade);
          applyFilters(nextGrade, query);
        }}
        className="w-auto"
      >
        <option value="">All grades</option>
        {[6, 7, 8, 9, 10, 11, 12].map((gradeOption) => (
          <option key={gradeOption} value={gradeOption}>
            Grade {gradeOption}
          </option>
        ))}
      </ThemedSelect>
      <button
        type="submit"
        className="h-8 rounded-md border border-[color:var(--border)] px-3 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--text)] hover:bg-[color:var(--surface-strong)]"
      >
        Search
      </button>
    </form>
  );
}
