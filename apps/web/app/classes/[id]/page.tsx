import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubjectStatsTable } from "@/features/analytics/components/subject-stats-table";
import { AdminNotes } from "@/features/notes/components/admin-notes";
import { ChartCard } from "@/features/analytics/components/chart-card";
import { AtRiskMiniTable } from "@/features/analytics/components/at-risk-mini-table";
import { CriteriaComparisonBars } from "@/features/analytics/components/criteria-comparison-bars";
import { SubjectTrendLines } from "@/features/analytics/components/subject-trend-lines";
import { TermTrendLine } from "@/features/analytics/components/term-trend-line";
import { StatTiles } from "@/features/analytics/components/stat-tiles";
import { getClassEntityDetail } from "@/lib/analytics/class-entities";
import { resolveSelectedTerm } from "@/lib/analytics/terms";
import { requireTenantSession } from "@/lib/auth/guards";

interface ClassDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ term?: string; year?: string }>;
}

export default async function ClassDetailPage({ params, searchParams }: ClassDetailPageProps) {
  const { activeOrganizationId } = await requireTenantSession();
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const yearId = resolvedSearchParams?.year;
  const term = await resolveSelectedTerm({
    organizationId: activeOrganizationId,
    yearId,
    termId: resolvedSearchParams?.term,
  });
  if (!term) {
    return <div className="text-sm text-[color:var(--text-muted)]">No term data yet.</div>;
  }

  const detail = await getClassEntityDetail({
    routeId: id,
    termId: term.id,
    academicYearId: term.academicYearId,
    organizationId: activeOrganizationId,
    atRiskLimit: 15,
  });
  if (!detail) {
    notFound();
  }

  const gradeLabel = detail.entity.gradeLevel ? `Level ${detail.entity.gradeLevel}` : "Level N/A";

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
              {detail.entity.classLabel}
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
              {detail.entity.studentCount.toLocaleString()}
            </div>
            <div className="text-xs text-[color:var(--text-muted)]">Enrolled</div>
          </CardContent>
        </Card>
        <Card className="transition-transform duration-300 ease-out hover:-translate-y-0.5">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
              Criterion Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[clamp(1.6rem,3vw,2.6rem)] font-semibold text-[color:var(--text)]">
              {detail.overall.averageScore.toFixed(2)}
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
              {detail.overall.riskLevel}
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
            value: detail.criteriaSummary.criterionA.toFixed(1),
            helper: "Avg across students",
          },
          {
            id: "criterion-b",
            label: "Criterion B",
            value: detail.criteriaSummary.criterionB.toFixed(1),
            helper: "Avg across students",
          },
          {
            id: "criterion-c",
            label: "Criterion C",
            value: detail.criteriaSummary.criterionC.toFixed(1),
            helper: "Avg across students",
          },
          {
            id: "criterion-d",
            label: "Criterion D",
            value: detail.criteriaSummary.criterionD.toFixed(1),
            helper: "Avg across students",
          },
        ]}
      />

      <SubjectStatsTable title="Class Subject Performance" data={detail.subjectStats} />

      <section className="stagger grid gap-3 sm:gap-4 xl:grid-cols-[2fr_1fr]">
        <ChartCard
          title="Assignment Trend"
          subtitle="Assignment-level criterion scores with term markers"
          exportContext={{
            entity: "Class",
            year: term.academicYear.name,
            term: term.name,
            chartType: "Assignment Trends",
          }}
          exportRows={detail.assignmentTrend.map((point) => ({
            pointType: point.kind,
            label: point.fullLabel,
            criterionA: point.criterionA ?? "",
            criterionB: point.criterionB ?? "",
            criterionC: point.criterionC ?? "",
            criterionD: point.criterionD ?? "",
          }))}
        >
          <TermTrendLine data={detail.assignmentTrend} />
        </ChartCard>
        <ChartCard
          title="Criterion Profile"
          subtitle="Current term criterion averages (0-8)"
          exportContext={{
            entity: "Class",
            year: term.academicYear.name,
            term: term.name,
            chartType: "Criterion Profile",
          }}
          exportRows={[
            {
              criterionA: detail.criteriaSummary.criterionA,
              criterionB: detail.criteriaSummary.criterionB,
              criterionC: detail.criteriaSummary.criterionC,
              criterionD: detail.criteriaSummary.criterionD,
            },
          ]}
        >
          <CriteriaComparisonBars values={detail.criteriaSummary} />
        </ChartCard>
      </section>

      <div className="stagger">
        <ChartCard
          title="Criterion Trends"
          subtitle="Academic-year criterion progression"
          exportContext={{
            entity: "Class",
            year: term.academicYear.name,
            term: term.name,
            chartType: "Criterion Trends",
          }}
          exportRows={detail.criterionTrends.map((point) => ({
            term: point.label,
            criterionA: point.criterionA,
            criterionB: point.criterionB,
            criterionC: point.criterionC,
            criterionD: point.criterionD,
          }))}
        >
          <SubjectTrendLines data={detail.criterionTrends} />
        </ChartCard>
      </div>

      <AtRiskMiniTable
        title="At-Risk Students"
        data={detail.atRisk}
        exportHref={`/api/reports/classes/${detail.entity.id}?year=${term.academicYearId}&term=${term.id}`}
        yearId={term.academicYearId}
        termId={term.id}
      />

      <AdminNotes pageKey={`class:${detail.entity.id}`} />
    </div>
  );
}
