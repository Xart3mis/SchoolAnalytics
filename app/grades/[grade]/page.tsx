import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubjectStatsTable } from "@/features/analytics/components/subject-stats-table";
import { AdminNotes } from "@/features/notes/components/admin-notes";
import { ChartCard } from "@/features/analytics/components/chart-card";
import { AtRiskMiniTable } from "@/features/analytics/components/at-risk-mini-table";
import { RiskBreakdownPie } from "@/features/analytics/components/risk-breakdown-pie";
import { SubjectTrendLines } from "@/features/analytics/components/subject-trend-lines";
import { TermTrendLine } from "@/features/analytics/components/term-trend-line";
import {
  getGradeOverallStat,
  getGradeSubjectStats,
} from "@/lib/analytics/aggregates";
import { getGradeRiskBreakdown, getGradeAtRiskList } from "@/lib/analytics/risk";
import { getGradeSubjectTrends, getGradeTermTrend } from "@/lib/analytics/trends";
import { getActiveTerm } from "@/lib/analytics/terms";
import { requireSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

interface GradeDetailPageProps {
  params: Promise<{ grade: string }>;
}

export default async function GradeDetailPage({ params }: GradeDetailPageProps) {
  await requireSession();
  const { grade } = await params;
  const gradeLevel = Number(grade);
  if (Number.isNaN(gradeLevel)) {
    notFound();
  }

  const term = await getActiveTerm();
  if (!term) {
    return <div className="text-sm text-slate-500">No term data yet.</div>;
  }

  const [subjectStats, overall, studentCount, classCount, trend, subjectTrends, riskBreakdown, atRisk] =
    await Promise.all([
    getGradeSubjectStats(gradeLevel, term.id),
    getGradeOverallStat(gradeLevel, term.id),
    prisma.student.count({ where: { gradeLevel } }),
    prisma.class.count({ where: { gradeLevel, academicYear: term.academicYear } }),
    getGradeTermTrend(gradeLevel, term.academicYear),
    getGradeSubjectTrends(gradeLevel, term.academicYear),
    getGradeRiskBreakdown(gradeLevel, term.id),
    getGradeAtRiskList(gradeLevel, term.id, 20),
  ]);

  if (subjectStats.length === 0 && studentCount === 0) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="stagger grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="transition-transform duration-300 ease-out hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {gradeLevel}
            </div>
            <div className="text-xs text-slate-500">{term.academicYear}</div>
          </CardContent>
        </Card>
        <Card className="transition-transform duration-300 ease-out hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {studentCount.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">{classCount} classes</div>
          </CardContent>
        </Card>
        <Card className="transition-transform duration-300 ease-out hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Avg Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {overall.averageScore.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="transition-transform duration-300 ease-out hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Risk Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {overall.riskLevel}
            </div>
            <div className="text-xs text-slate-500">{term.trimester}</div>
          </CardContent>
        </Card>
      </section>

      <SubjectStatsTable title="Grade Subject Performance" data={subjectStats} />

      <section className="stagger grid gap-4 xl:grid-cols-[2fr_1fr]">
        <ChartCard title="Trimester Trend" subtitle="Average performance across terms">
          <TermTrendLine data={trend} />
        </ChartCard>
        <ChartCard title="Risk Breakdown" subtitle="Current term risk profile">
          <RiskBreakdownPie data={riskBreakdown} />
        </ChartCard>
      </section>

      <div className="stagger">
        <ChartCard title="Subject Trends" subtitle="Trimester comparison by subject">
          <SubjectTrendLines data={subjectTrends} />
        </ChartCard>
      </div>

      <AtRiskMiniTable
        title="At-Risk Students"
        data={atRisk}
        exportHref={`/api/reports/grades/${gradeLevel}`}
      />

      <AdminNotes pageKey={`grade:${gradeLevel}`} />
    </div>
  );
}
