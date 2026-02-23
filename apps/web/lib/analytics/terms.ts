import { prisma } from "@/lib/prisma";

export async function getActiveTerm(organizationId: string, termId?: string) {
  if (termId) {
    return prisma.academicTerm.findFirst({
      where: {
        id: termId,
        academicYear: { organizationId },
      },
      include: { academicYear: true },
    });
  }
  return prisma.academicTerm.findFirst({
    where: { academicYear: { organizationId } },
    orderBy: { startDate: "desc" },
    include: { academicYear: true },
  });
}

export async function getActiveTermForYear(organizationId: string, academicYearId: string) {
  return prisma.academicTerm.findFirst({
    where: {
      academicYearId,
      academicYear: { organizationId },
    },
    orderBy: { startDate: "desc" },
    include: { academicYear: true },
  });
}

export async function getAcademicYearTerms(organizationId: string, academicYearId: string) {
  return prisma.academicTerm.findMany({
    where: {
      academicYearId,
      academicYear: { organizationId },
    },
    orderBy: { startDate: "asc" },
  });
}

export async function resolveSelectedTerm({
  organizationId,
  yearId,
  termId,
}: {
  organizationId: string;
  yearId?: string;
  termId?: string;
}) {
  if (termId) {
    const byTerm = await getActiveTerm(organizationId, termId);
    if (byTerm && (!yearId || byTerm.academicYearId === yearId)) {
      return byTerm;
    }
  }
  if (yearId) {
    const byYear = await getActiveTermForYear(organizationId, yearId);
    if (byYear) return byYear;
  }
  return getActiveTerm(organizationId);
}
