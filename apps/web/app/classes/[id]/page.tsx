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
  getClassOverallStat,
  getClassCriteriaSummary,
  getClassSubjectStats,
} from "@/lib/analytics/aggregates";
import { getClassRiskBreakdown, getClassAtRiskList } from "@/lib/analytics/risk";
import { getClassAssignmentTrend, getClassSubjectTrends } from "@/lib/analytics/trends";
import { getActiveTerm } from "@/lib/analytics/terms";
import { requireSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

interface ClassDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClassDetailPage({ params }: ClassDetailPageProps) {
  await requireSession();
  const { id } = await params;
  const cls = await prisma.classSection.findUnique({
    where: { id },
    include: {
      course: { include: { gradeLevel: true } },
      academicTerm: { include: { academicYear: true } },
    },
  });
  if (!cls) {
    notFound();
  }

  const term = cls.academicTerm ?? (await getActiveTerm());
  if (!term) {
    return <div className="text-sm text-[color:var(--text-muted)]">No term data yet.</div>;
  }

  const [subjectStats, overall, criteriaSummary, enrollmentCount, trend, subjectTrends, riskBreakdown, atRisk] =
    await Promise.all([
      getClassSubjectStats(cls.id, term.id),
      getClassOverallStat(cls.id, term.id),
      getClassCriteriaSummary(cls.id, term.id),
      prisma.enrollment.count({ where: { classSectionId: cls.id, role: "STUDENT" } }),
      getClassAssignmentTrend(cls.id, term.academicYearId),
      getClassSubjectTrends(cls.courseId, term.academicYearId),
      getClassRiskBreakdown(cls.id, term.id),
      getClassAtRiskList(cls.id, term.id, 15),
    ]);

  const gradeLabel = cls.course.gradeLevel?.name
    ? `Grade ${cls.course.gradeLevel.name}`
    : "Grade N/A";

  return (
    <div className="flex flex-col gap-6">
      <section className="stagger grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="transition-transform duration-300 ease-out hover:-translate-y-0.5">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
              Class
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[clamp(1.4rem,2.4vw,2.1rem)] font-semibold text-[color:var(--text)]">
              {cls.name}
            </div>
            <div className="text-xs text-[color:var(--text-muted)]">{gradeLabel}</div>
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
              {enrollmentCount.toLocaleString()}
            </div>
            <div className="text-xs text-[color:var(--text-muted)]">Enrolled</div>
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
            <div className="text-xs text-[color:var(--text-muted)]">
              {term.academicYear.name} {term.name}
            </div>
          </CardContent>
        </Card>
      </section>

      <StatTiles
        items={[
          {
            id: "criterion-a",
            label: "Criterion A",
            value: criteriaSummary.criterionA.toFixed(1),
            helper: "Avg across students",
          },
          {
            id: "criterion-b",
            label: "Criterion B",
            value: criteriaSummary.criterionB.toFixed(1),
            helper: "Avg across students",
          },
          {
            id: "criterion-c",
            label: "Criterion C",
            value: criteriaSummary.criterionC.toFixed(1),
            helper: "Avg across students",
          },
          {
            id: "criterion-d",
            label: "Criterion D",
            value: criteriaSummary.criterionD.toFixed(1),
            helper: "Avg across students",
          },
        ]}
      />

      <SubjectStatsTable title="Class Subject Performance" data={subjectStats} />

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
        exportHref={`/api/reports/classes/${cls.id}`}
        termId={term.id}
      />

      <AdminNotes pageKey={`class:${cls.id}`} />
    </div>
  );
}
