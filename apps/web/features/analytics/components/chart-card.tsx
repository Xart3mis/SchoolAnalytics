"use client";

import * as React from "react";
import { FileImage, FileSpreadsheet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exportChartAreaAsPng, exportRowsAsCsv, type CsvRow } from "@/features/analytics/components/chart-export";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  exportRows?: CsvRow[];
  exportFileName?: string;
  exportContext?: {
    entity: "Student" | "Class" | "Grade";
    year: string;
    term: string;
    chartType: string;
  };
}

export function ChartCard({
  title,
  subtitle,
  children,
  exportRows,
  exportFileName,
  exportContext,
}: ChartCardProps) {
  const chartContainerRef = React.useRef<HTMLDivElement | null>(null);
  const fileBase =
    exportFileName ??
    (exportContext
      ? `${exportContext.entity}-${exportContext.year}-${exportContext.term}-${exportContext.chartType}`
      : title);

  const handleImageExport = React.useCallback(async () => {
    if (!chartContainerRef.current) return;
    await exportChartAreaAsPng(chartContainerRef.current, fileBase);
  }, [fileBase]);

  const handleCsvExport = React.useCallback(() => {
    if (!exportRows || exportRows.length === 0) return;
    exportRowsAsCsv(exportRows, fileBase);
  }, [exportRows, fileBase]);

  return (
    <Card className="h-full transition-transform duration-300 ease-out hover:-translate-y-0.5">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)] sm:text-sm">
              {title}
            </CardTitle>
            {subtitle ? <p className="text-xs text-[color:var(--text-muted)]">{subtitle}</p> : null}
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleImageExport}>
              <FileImage className="mr-1 h-3.5 w-3.5" /> PNG
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCsvExport}
              disabled={!exportRows || exportRows.length === 0}
            >
              <FileSpreadsheet className="mr-1 h-3.5 w-3.5" /> CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartContainerRef}>{children}</div>
      </CardContent>
    </Card>
  );
}
