"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ThemedSelect } from "@/components/ui/themed-select";

interface ClassesFiltersProps {
  initialGrade?: number;
  yearId?: string;
  termId?: string;
}

export function ClassesFilters({ initialGrade, yearId, termId }: ClassesFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [grade, setGrade] = React.useState(initialGrade ? String(initialGrade) : "");

  const applyFilters = React.useCallback(
    (nextGrade: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      params.delete("q");
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
    <div className="flex w-full items-center gap-2 sm:w-auto">
      <ThemedSelect
        value={grade}
        onChange={(event) => {
          const nextGrade = event.target.value;
          setGrade(nextGrade);
          applyFilters(nextGrade);
        }}
        className="w-auto"
      >
        <option value="">All MYP levels</option>
        {[1, 2, 3, 4, 5].map((gradeOption) => (
          <option key={gradeOption} value={gradeOption}>
            MYP {gradeOption}
          </option>
        ))}
      </ThemedSelect>
    </div>
  );
}
