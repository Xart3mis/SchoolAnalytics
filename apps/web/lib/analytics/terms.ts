import { prisma } from "@/lib/prisma";

export async function getActiveTerm(termId?: string) {
  if (termId) {
    return prisma.academicTerm.findUnique({
      where: { id: termId },
      include: { academicYear: true },
    });
  }
  return prisma.academicTerm.findFirst({
    orderBy: { startDate: "desc" },
    include: { academicYear: true },
  });
}

export async function getActiveTermForYear(academicYearId: string) {
  return prisma.academicTerm.findFirst({
    where: { academicYearId },
    orderBy: { startDate: "desc" },
    include: { academicYear: true },
  });
}

export async function getAcademicYearTerms(academicYearId: string) {
  return prisma.academicTerm.findMany({
    where: { academicYearId },
    orderBy: { startDate: "asc" },
  });
}

export async function resolveSelectedTerm({
  yearId,
  termId,
}: {
  yearId?: string;
  termId?: string;
}) {
  if (termId) {
    const byTerm = await getActiveTerm(termId);
    if (byTerm && (!yearId || byTerm.academicYearId === yearId)) {
      return byTerm;
    }
  }
  if (yearId) {
    const byYear = await getActiveTermForYear(yearId);
    if (byYear) return byYear;
  }
  return getActiveTerm();
}
