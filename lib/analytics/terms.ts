import { prisma } from "@/lib/prisma";

export async function getActiveTerm(termId?: string) {
  if (termId) {
    return prisma.term.findUnique({ where: { id: termId } });
  }
  return prisma.term.findFirst({ orderBy: { createdAt: "desc" } });
}

export async function getAcademicYearTerms(academicYear: string) {
  return prisma.term.findMany({
    where: { academicYear },
    orderBy: { trimester: "asc" },
  });
}
