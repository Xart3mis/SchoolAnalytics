import { NextResponse } from "next/server";

import { getMockDashboardData } from "@/lib/mock-data";
import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const data = getMockDashboardData();

  await prisma.adminNote.deleteMany();
  await prisma.studentSubjectTermScore.deleteMany();
  await prisma.studentTermSummary.deleteMany();
  await prisma.studentClassEnrollment.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.student.deleteMany();
  await prisma.class.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.term.deleteMany();

  const term = await prisma.term.create({
    data: { academicYear: "2025-2026", trimester: "T2" },
  });

  await prisma.subject.createMany({
    data: [
      { code: "MATH", name: "Mathematics" },
      { code: "ENG", name: "English" },
      { code: "SCI", name: "Science" },
      { code: "HIST", name: "History" },
    ],
  });

  const subjects = await prisma.subject.findMany();

  const classMap = new Map<number, { id: string }>();
  for (const grade of [9, 10, 11, 12]) {
    const created = await prisma.class.create({
      data: { name: `Grade ${grade} - A`, gradeLevel: grade, academicYear: "2025-2026" },
    });
    classMap.set(grade, created);
  }

  await prisma.student.createMany({
    data: data.atRisk.map((student, index) => {
      const gradeLevel = Number(student.gradeLevel.replace("Grade ", ""));
      return {
        fullName: student.name,
        gradeLevel,
        externalId: `mock-${index + 1}`,
      };
    }),
  });

  const students = await prisma.student.findMany({
    where: { externalId: { startsWith: "mock-" } },
  });

  for (const student of students) {
    const classEntry = classMap.get(student.gradeLevel);
    if (!classEntry) continue;

    await prisma.studentClassEnrollment.create({
      data: {
        studentId: student.id,
        classId: classEntry.id,
      },
    });

    for (const subject of subjects) {
      const base = (student.id.charCodeAt(0) + subject.code.charCodeAt(0)) % 8;
      await prisma.studentSubjectTermScore.create({
        data: {
          studentId: student.id,
          classId: classEntry.id,
          subjectId: subject.id,
          termId: term.id,
          criterionA: 1 + ((base + 1) % 8),
          criterionB: 1 + ((base + 3) % 8),
          criterionC: 1 + ((base + 5) % 8),
          criterionD: 1 + ((base + 7) % 8),
        },
      });
    }
  }

  if (process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD) {
    const passwordHash = await hashPassword(process.env.SEED_ADMIN_PASSWORD);
    await prisma.user.create({
      data: {
        email: process.env.SEED_ADMIN_EMAIL.toLowerCase(),
        passwordHash,
        role: "ADMIN",
        displayName: "Admin",
      },
    });
  }

  return NextResponse.json({ status: "ok", inserted: students.length });
}
