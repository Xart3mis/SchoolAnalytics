import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubjectStatsTable } from "@/features/analytics/components/subject-stats-table";
import { AdminNotes } from "@/features/notes/components/admin-notes";
import { ChartCard } from "@/features/analytics/components/chart-card";
import { SubjectTrendLines } from "@/features/analytics/components/subject-trend-lines";
import { SubjectCriterionRadar } from "@/features/analytics/components/subject-criterion-radar";
import { TermTrendLine } from "@/features/analytics/components/term-trend-line";
import { StatTiles } from "@/features/analytics/components/stat-tiles";
import {
  getStudentOverallStat,
  getStudentTrimmedPercentileComposite,
  getStudentCriteriaSummary,
  getStudentSubjectStats,
} from "@/lib/analytics/aggregates";
import { getStudentAssignmentTrend, getStudentSubjectTrends } from "@/lib/analytics/trends";
import { resolveSelectedTerm } from "@/lib/analytics/terms";
import { requireSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@school-analytics/db/client";

interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ term?: string; year?: string }>;
}

export default async function StudentDetailPage({ params, searchParams }: StudentDetailPageProps) {
  await requireSession();
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const yearId = resolvedSearchParams?.year;
  const student = await prisma.student.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!student) {
    notFound();
  }

  const term = await resolveSelectedTerm({
    yearId,
    termId: resolvedSearchParams?.term,
  });
  if (!term) {
    return <div className="text-sm text-[color:var(--text-muted)]">No term data yet.</div>;
  }

  const [subjectStats, overall, percentileComposite, criteriaSummary, trend, subjectTrends, gradeRow] =
    await Promise.all([
      getStudentSubjectStats(student.id, term.id),
      getStudentOverallStat(student.id, term.id),
      getStudentTrimmedPercentileComposite(student.id, term.id),
      getStudentCriteriaSummary(student.id, term.id),
      getStudentAssignmentTrend(student.id, term.academicYearId),
      getStudentSubjectTrends(student.id, term.academicYearId),
      prisma.$queryRaw<Array<{ gradeLevel: number }>>(Prisma.sql`
      SELECT MIN(gl."name")::int AS "gradeLevel"
      FROM "GradeEntry" ge
      JOIN "Assignment" a ON a."id" = ge."assignmentId"
      JOIN "ClassSection" cs ON cs."id" = a."classSectionId"
      JOIN "Course" c ON c."id" = cs."courseId"
      JOIN "GradeLevel" gl ON gl."id" = c."gradeLevelId"
      WHERE ge."studentId" = ${student.id} AND cs."academicTermId" = ${term.id}
      `),
    ]);

  const gradeLevel = gradeRow[0]?.gradeLevel;
  const combinedName = [student.firstName, student.lastName].filter(Boolean).join(" ");
  const studentName = student.user.displayName || combinedName || student.user.email;

  return (
    <div className="flex flex-col gap-6">
      <section className="stagger grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="transition-transform duration-300 ease-out hover:-translate-y-0.5">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
              Student
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[clamp(1.4rem,2.4vw,2.1rem)] font-semibold text-[color:var(--text)]">
              {studentName}
            </div>
            <div className="text-xs text-[color:var(--text-muted)]">
              {gradeLevel ? `Level ${gradeLevel}` : "Level N/A"}
            </div>
          </CardContent>
        </Card>
        <Card className="transition-transform duration-300 ease-out hover:-translate-y-0.5">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
              Term
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[clamp(1.6rem,3vw,2.6rem)] font-semibold text-[color:var(--text)]">
              {term.name}
            </div>
            <div className="text-xs text-[color:var(--text-muted)]">{term.academicYear.name}</div>
          </CardContent>
        </Card>
        <Card className="transition-transform duration-300 ease-out hover:-translate-y-0.5">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
              Composite Percentile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[clamp(1.6rem,3vw,2.6rem)] font-semibold text-[color:var(--text)]">
              {percentileComposite.subjectCount > 0
                ? `${percentileComposite.composite.toFixed(1)}%`
                : "N/A"}
            </div>
            <div className="text-xs text-[color:var(--text-muted)]">
              {percentileComposite.subjectCount > 0
                ? `Trimmed avg (${percentileComposite.trimmedSubjectCount}/${percentileComposite.subjectCount} subjects)`
                : "No subject data in selected term"}
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
          </CardContent>
        </Card>
      </section>

      {/* <StatTiles */}
      {/*   items={[ */}
      {/*     { */}
      {/*       id: "criterion-a", */}
      {/*       label: "Criterion A", */}
      {/*       value: criteriaSummary.criterionA.toFixed(1), */}
      {/*       helper: "Avg across subjects", */}
      {/*     }, */}
      {/*     { */}
      {/*       id: "criterion-b", */}
      {/*       label: "Criterion B", */}
      {/*       value: criteriaSummary.criterionB.toFixed(1), */}
      {/*       helper: "Avg across subjects", */}
      {/*     }, */}
      {/*     { */}
      {/*       id: "criterion-c", */}
      {/*       label: "Criterion C", */}
      {/*       value: criteriaSummary.criterionC.toFixed(1), */}
      {/*       helper: "Avg across subjects", */}
      {/*     }, */}
      {/*     { */}
      {/*       id: "criterion-d", */}
      {/*       label: "Criterion D", */}
      {/*       value: criteriaSummary.criterionD.toFixed(1), */}
      {/*       helper: "Avg across subjects", */}
      {/*     }, */}
      {/*   ]} */}
      {/* /> */}

      <SubjectStatsTable title="Subject Performance" data={subjectStats} />

      <section className="stagger grid gap-3 sm:gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="xl:col-span-2">
          <ChartCard
            title="Assignment Trend"
            subtitle="Assignment-level criterion scores with term markers"
            exportContext={{
              entity: "Student",
              year: term.academicYear.name,
              term: term.name,
              chartType: "Assignment Trends",
            }}
            exportRows={trend.map((point) => ({
              pointType: point.kind,
              label: point.fullLabel,
              criterionA: point.criterionA ?? "",
              criterionB: point.criterionB ?? "",
              criterionC: point.criterionC ?? "",
              criterionD: point.criterionD ?? "",
            }))}
          >
            <TermTrendLine data={trend} />
          </ChartCard>
        </div>
        <ChartCard
          title="Criterion Trends"
          subtitle="Academic-year criterion progression"
          exportContext={{
            entity: "Student",
            year: term.academicYear.name,
            term: term.name,
            chartType: "Criterion Trends",
          }}
          exportRows={subjectTrends.map((point) => ({
            term: point.label,
            criterionA: point.criterionA,
            criterionB: point.criterionB,
            criterionC: point.criterionC,
            criterionD: point.criterionD,
          }))}
        >
          <SubjectTrendLines data={subjectTrends} />
        </ChartCard>
        <ChartCard
          title="Criterion Radar"
          subtitle="Selected term criterion profile by subject"
          exportContext={{
            entity: "Student",
            year: term.academicYear.name,
            term: term.name,
            chartType: "Criterion Radar",
          }}
          exportRows={[
            {
              subject: "Average",
              criterionA: criteriaSummary.criterionA,
              criterionB: criteriaSummary.criterionB,
              criterionC: criteriaSummary.criterionC,
              criterionD: criteriaSummary.criterionD,
            },
            ...subjectStats.map((row) => ({
              subject: row.subjectName,
              criterionA: row.criterionA,
              criterionB: row.criterionB,
              criterionC: row.criterionC,
              criterionD: row.criterionD,
            })),
          ]}
        >
          <SubjectCriterionRadar averageValues={criteriaSummary} subjects={subjectStats} />
        </ChartCard>
      </section>

      <AdminNotes pageKey={`student:${student.id}`} />
    </div>
  );
}
