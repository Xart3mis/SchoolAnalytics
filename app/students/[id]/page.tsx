import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubjectStatsTable } from "@/features/analytics/components/subject-stats-table";
import { AdminNotes } from "@/features/notes/components/admin-notes";
import { ChartCard } from "@/features/analytics/components/chart-card";
import { SubjectTrendLines } from "@/features/analytics/components/subject-trend-lines";
import { TermTrendLine } from "@/features/analytics/components/term-trend-line";
import {
  getStudentOverallStat,
  getStudentSubjectStats,
} from "@/lib/analytics/aggregates";
import { getStudentSubjectTrends, getStudentTermTrend } from "@/lib/analytics/trends";
import { getActiveTerm } from "@/lib/analytics/terms";
import { requireSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  await requireSession();
  const { id } = await params;
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) {
    notFound();
  }

  const term = await getActiveTerm();
  if (!term) {
    return <div className="text-sm text-slate-500">No term data yet.</div>;
  }

  const [subjectStats, overall, trend, subjectTrends] = await Promise.all([
    getStudentSubjectStats(student.id, term.id),
    getStudentOverallStat(student.id, term.id),
    getStudentTermTrend(student.id, term.academicYear),
    getStudentSubjectTrends(student.id, term.academicYear),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <section className="stagger grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="transition-transform duration-300 ease-out hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Student
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {student.fullName}
            </div>
            <div className="text-xs text-slate-500">Grade {student.gradeLevel}</div>
          </CardContent>
        </Card>
        <Card className="transition-transform duration-300 ease-out hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Term
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {term.trimester}
            </div>
            <div className="text-xs text-slate-500">{term.academicYear}</div>
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
          </CardContent>
        </Card>
      </section>

      <SubjectStatsTable title="Subject Performance" data={subjectStats} />

      <section className="stagger grid gap-4 xl:grid-cols-[2fr_1fr]">
        <ChartCard title="Trimester Trend" subtitle="Average score over the year">
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
