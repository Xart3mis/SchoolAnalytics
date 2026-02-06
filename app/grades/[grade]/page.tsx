import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubjectStatsTable } from "@/features/analytics/components/subject-stats-table";
import { AdminNotes } from "@/features/notes/components/admin-notes";
import { ChartCard } from "@/features/analytics/components/chart-card";
import { AtRiskMiniTable } from "@/features/analytics/components/at-risk-mini-table";
import { RiskBreakdownPie } from "@/features/analytics/components/risk-breakdown-pie";
import { SubjectTrendLines } from "@/features/analytics/components/subject-trend-lines";
import { TermTrendLine } from "@/features/analytics/components/term-trend-line";
import { StatTiles } from "@/features/analytics/components/stat-tiles";
import {
  getGradeOverallStat,
  getGradeCriteriaSummary,
  getGradeSubjectStats,
} from "@/lib/analytics/aggregates";
import { getGradeRiskBreakdown, getGradeAtRiskList } from "@/lib/analytics/risk";
import { getGradeAssignmentTrend, getGradeSubjectTrends } from "@/lib/analytics/trends";
import { getActiveTerm, getActiveTermForYear } from "@/lib/analytics/terms";
import { requireSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface GradeDetailPageProps {
  params: Promise<{ grade: string }>;
  searchParams?: Promise<{ term?: string; year?: string }>;
}

export default async function GradeDetailPage({ params, searchParams }: GradeDetailPageProps) {
  await requireSession();
  const { grade } = await params;
  const resolvedSearchParams = await searchParams;
  const termId = resolvedSearchParams?.term;
  const yearId = resolvedSearchParams?.year;
  const gradeLevel = Number(grade);
  if (Number.isNaN(gradeLevel)) {
    notFound();
  }

  let term = termId ? await getActiveTerm(termId) : null;
  if (!term && yearId) {
    term = await getActiveTermForYear(yearId);
  }
  if (!term) {
    term = await getActiveTerm();
  }
  if (!term) {
    return <div className="text-sm text-[color:var(--text-muted)]">No term data yet.</div>;
  }

  const [subjectStats, overall, criteriaSummary, studentCountRow, classCountRow, trend, subjectTrends, riskBreakdown, atRisk] =
    await Promise.all([
      getGradeSubjectStats(gradeLevel, term.id),
      getGradeOverallStat(gradeLevel, term.id),
      getGradeCriteriaSummary(gradeLevel, term.id),
      prisma.$queryRaw<Array<{ count: number }>>(Prisma.sql`
        SELECT COUNT(DISTINCT ge."studentId")::int AS count
        FROM "GradeEntry" ge
        JOIN "Assignment" a ON a."id" = ge."assignmentId"
        JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
        JOIN "Course" c ON c."id" = cs."courseId"
        JOIN "GradeLevel" gl ON gl."id" = c."gradeLevelId"
        WHERE gl."name" = ${String(gradeLevel)} AND cs."academicTermId" = ${term.id}
      `),
      prisma.$queryRaw<Array<{ count: number }>>(Prisma.sql`
        SELECT COUNT(*)::int AS count
        FROM "ClassSection" cs
        JOIN "Course" c ON c."id" = cs."courseId"
        JOIN "GradeLevel" gl ON gl."id" = c."gradeLevelId"
        WHERE gl."name" = ${String(gradeLevel)} AND cs."academicTermId" = ${term.id}
      `),
      getGradeAssignmentTrend(gradeLevel, term.academicYearId),
      getGradeSubjectTrends(gradeLevel, term.academicYearId),
      getGradeRiskBreakdown(gradeLevel, term.id),
      getGradeAtRiskList(gradeLevel, term.id, 20),
    ]);

  const studentCount = studentCountRow[0]?.count ?? 0;
  const classCount = classCountRow[0]?.count ?? 0;

  if (subjectStats.length === 0 && studentCount === 0) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="stagger grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="transition-transform duration-300 ease-out hover:-translate-y-0.5">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
              Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[clamp(1.6rem,3vw,2.6rem)] font-semibold text-[color:var(--text)]">
              {gradeLevel}
            </div>
            <div className="text-xs text-[color:var(--text-muted)]">{term.academicYear.name}</div>
          </CardContent>
        </Card>
        <Card className="transition-transform duration-300 ease-out hover:-translate-y-0.5">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
              Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[clamp(1.6rem,3vw,2.6rem)] font-semibold text-[color:var(--text)]">
              {studentCount.toLocaleString()}
            </div>
            <div className="text-xs text-[color:var(--text-muted)]">{classCount} classes</div>
          </CardContent>
        </Card>
        <Card className="transition-transform duration-300 ease-out hover:-translate-y-0.5">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
              Avg Final Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[clamp(1.6rem,3vw,2.6rem)] font-semibold text-[color:var(--text)]">
              {overall.averageScore.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="transition-transform duration-300 ease-out hover:-translate-y-0.5">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
              Risk Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[clamp(1.4rem,2.4vw,2.1rem)] font-semibold text-[color:var(--text)]">
              {overall.riskLevel}
            </div>
            <div className="text-xs text-[color:var(--text-muted)]">{term.name}</div>
          </CardContent>
        </Card>
      </section>

      <StatTiles
        items={[
          {
            id: "criterion-a",
            label: "Criterion A",
            value: criteriaSummary.criterionA.toFixed(1),
            helper: "Avg across grade",
          },
          {
            id: "criterion-b",
            label: "Criterion B",
            value: criteriaSummary.criterionB.toFixed(1),
            helper: "Avg across grade",
          },
          {
            id: "criterion-c",
            label: "Criterion C",
            value: criteriaSummary.criterionC.toFixed(1),
            helper: "Avg across grade",
          },
          {
            id: "criterion-d",
            label: "Criterion D",
            value: criteriaSummary.criterionD.toFixed(1),
            helper: "Avg across grade",
          },
        ]}
      />

      <SubjectStatsTable title="Grade Subject Performance" data={subjectStats} />

      <section className="stagger grid gap-3 sm:gap-4 xl:grid-cols-[2fr_1fr]">
        <ChartCard
          title="Assignment Trend"
          subtitle="Assignment-level final grades with term markers"
        >
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
        termId={term.id}
      />

      <AdminNotes pageKey={`grade:${gradeLevel}`} />
    </div>
  );
}
