import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubjectStatsTable } from "@/features/analytics/components/subject-stats-table";
import { AdminNotes } from "@/features/notes/components/admin-notes";
import { ChartCard } from "@/features/analytics/components/chart-card";
import { SubjectTrendLines } from "@/features/analytics/components/subject-trend-lines";
import { TermTrendLine } from "@/features/analytics/components/term-trend-line";
import { StatTiles } from "@/features/analytics/components/stat-tiles";
import {
  getStudentOverallStat,
  getStudentCriteriaSummary,
  getStudentSubjectStats,
} from "@/lib/analytics/aggregates";
import { getStudentAssignmentTrend, getStudentSubjectTrends } from "@/lib/analytics/trends";
import { getActiveTerm, getActiveTermForYear } from "@/lib/analytics/terms";
import { requireSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ term?: string; year?: string }>;
}

export default async function StudentDetailPage({ params, searchParams }: StudentDetailPageProps) {
  await requireSession();
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const termId = resolvedSearchParams?.term;
  const yearId = resolvedSearchParams?.year;
  const student = await prisma.student.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!student) {
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

  const [subjectStats, overall, criteriaSummary, trend, subjectTrends, gradeRow] = await Promise.all([
    getStudentSubjectStats(student.id, term.id),
    getStudentOverallStat(student.id, term.id),
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
              {gradeLevel ? `Grade ${gradeLevel}` : "Grade N/A"}
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
          </CardContent>
        </Card>
      </section>

      <StatTiles
        items={[
          {
            id: "criterion-a",
            label: "Criterion A",
            value: criteriaSummary.criterionA.toFixed(1),
            helper: "Avg across subjects",
          },
          {
            id: "criterion-b",
            label: "Criterion B",
            value: criteriaSummary.criterionB.toFixed(1),
            helper: "Avg across subjects",
          },
          {
            id: "criterion-c",
            label: "Criterion C",
            value: criteriaSummary.criterionC.toFixed(1),
            helper: "Avg across subjects",
          },
          {
            id: "criterion-d",
            label: "Criterion D",
            value: criteriaSummary.criterionD.toFixed(1),
            helper: "Avg across subjects",
          },
        ]}
      />

      <SubjectStatsTable title="Subject Performance" data={subjectStats} />

      <section className="stagger grid gap-3 sm:gap-4 xl:grid-cols-[2fr_1fr]">
        <ChartCard
          title="Assignment Trend"
          subtitle="Assignment-level final grades with term markers"
        >
          <TermTrendLine data={trend} />
        </ChartCard>
        <ChartCard title="Subject Trends" subtitle="Trimester comparison">
          <SubjectTrendLines data={subjectTrends} />
        </ChartCard>
      </section>

      <AdminNotes pageKey={`student:${student.id}`} />
    </div>
  );
}
