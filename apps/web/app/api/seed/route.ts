import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { hashPassword } from "@/lib/auth/password";
import { getMockDashboardData } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

const SUBJECTS = [
  { code: "MATH", name: "Mathematics" },
  { code: "ENG", name: "English" },
  { code: "SCI", name: "Science" },
  { code: "HIST", name: "History" },
];

export async function POST() {
  const data = getMockDashboardData();

  const q = (id: string) => `"${id.replace(/"/g, '""')}"`;

  for (const { tablename } of await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`) {
    if (!q(tablename).includes("prisma"))
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${q(tablename)} CASCADE;`);
  }

  for (const { relname } of await prisma.$queryRaw<
    Array<{ relname: string }>
  >`SELECT c.relname
  FROM pg_class AS c
  JOIN pg_namespace AS n ON c.relnamespace = n.oid
  WHERE c.relkind='S' AND n.nspname='public';`) {
    await prisma.$executeRawUnsafe(
      `ALTER SEQUENCE ${q(relname)} RESTART WITH 1;`,
    );
  }

  const organization = await prisma.organization.create({
    data: { name: "Sample School" },
  });

  const academicYear = await prisma.academicYear.create({
    data: {
      name: "2025-2026",
      startDate: new Date("2025-08-15"),
      endDate: new Date("2026-06-15"),
      organizationId: organization.id,
    },
  });

  const termDefinitions = [
    { name: "T1", startDate: new Date("2025-08-15"), endDate: new Date("2025-11-30") },
    { name: "T2", startDate: new Date("2025-12-01"), endDate: new Date("2026-03-15") },
    { name: "T3", startDate: new Date("2026-03-16"), endDate: new Date("2026-06-15") },
  ];

  const terms = [] as Array<{ id: string; name: string; startDate: Date; endDate: Date }>;
  for (const term of termDefinitions) {
    terms.push(
      await prisma.academicTerm.create({
        data: {
          ...term,
          academicYearId: academicYear.id,
        },
      })
    );
  }

  const gradeLevels = [] as Array<{ id: string; name: string }>;
  for (const grade of [9, 10, 11, 12]) {
    gradeLevels.push(
      await prisma.gradeLevel.create({
        data: {
          name: String(grade),
        },
      })
    );
  }

  const gradeLevelByName = new Map(gradeLevels.map((level) => [level.name, level]));
  const courses = [] as Array<{ id: string; name: string; gradeLevelId: string; subjectIndex: number }>;
  for (const level of gradeLevels) {
    for (const [subjectIndex, subject] of SUBJECTS.entries()) {
      const course = await prisma.course.create({
        data: {
          name: subject.name,
          code: subject.code,
          organizationId: organization.id,
          gradeLevelId: level.id,
        },
      });
      courses.push({
        id: course.id,
        name: course.name,
        gradeLevelId: level.id,
        subjectIndex,
      });
    }
  }

  const courseById = new Map(courses.map((course) => [course.id, course]));

  const classSections = [] as Array<{ id: string; courseId: string; academicTermId: string }>;
  const classSectionByCourseTerm = new Map<string, string>();
  const classSectionsByGradeLevel = new Map<string, string[]>();

  for (const term of terms) {
    for (const course of courses) {
      const gradeLabel = gradeLevels.find((level) => level.id === course.gradeLevelId)?.name ?? "";
      const classSection = await prisma.classSection.create({
        data: {
          name: `Grade ${gradeLabel} ${course.name} - ${term.name}`,
          organizationId: organization.id,
          courseId: course.id,
          academicYearId: academicYear.id,
          academicTermId: term.id,
        },
      });
      classSections.push({
        id: classSection.id,
        courseId: course.id,
        academicTermId: term.id,
      });
      classSectionByCourseTerm.set(`${course.id}:${term.id}`, classSection.id);
      const existing = classSectionsByGradeLevel.get(course.gradeLevelId) ?? [];
      existing.push(classSection.id);
      classSectionsByGradeLevel.set(course.gradeLevelId, existing);
    }
  }

  const assignmentsByClassSection = new Map<string, { id: string; index: number }[]>();
  for (const classSection of classSections) {
    const course = courseById.get(classSection.courseId);
    if (!course) continue;
    const term = terms.find((t) => t.id === classSection.academicTermId);
    if (!term) continue;
    const assignments: { id: string; index: number }[] = [];
    for (let index = 1; index <= 4; index += 1) {
      const dueDate = new Date(term.startDate.getTime() + index * 7 * 24 * 60 * 60 * 1000);
      const created = await prisma.assignment.create({
        data: {
          classSectionId: classSection.id,
          title: `${course.name} Checkpoint ${index}`,
          type: "FORMATIVE",
          dueDate,
          maxScore: 8,
        },
      });
      assignments.push({ id: created.id, index });
    }
    assignmentsByClassSection.set(classSection.id, assignments);
  }

  const students = [] as Array<{ id: string; gradeLevelId: string; index: number }>;
  for (const [index, student] of data.atRisk.entries()) {
    const [firstName, ...lastNameParts] = student.name.split(" ");
    const lastName = lastNameParts.join(" ") || null;
    const gradeNumber = Number(student.gradeLevel.replace("Grade ", ""));
    const gradeLevel = gradeLevelByName.get(String(gradeNumber));
    if (!gradeLevel) continue;

    const user = await prisma.user.create({
      data: {
        email: `student${index + 1}@example.com`,
        role: "STUDENT",
        displayName: student.name,
        organizationId: organization.id,
      },
    });

    const studentRecord = await prisma.student.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        firstName: firstName || null,
        lastName,
      },
    });

    students.push({ id: studentRecord.id, gradeLevelId: gradeLevel.id, index });
  }

  const enrollments = [] as Array<{ classSectionId: string; studentId: string; role: "STUDENT" }>;
  for (const student of students) {
    const classSectionIds = classSectionsByGradeLevel.get(student.gradeLevelId) ?? [];
    for (const classSectionId of classSectionIds) {
      enrollments.push({
        classSectionId,
        studentId: student.id,
        role: "STUDENT",
      });
    }
  }

  if (enrollments.length) {
    await prisma.enrollment.createMany({ data: enrollments, skipDuplicates: true });
  }

  const gradeEntries = [] as Array<{
    id: string;
    studentId: string;
    assignmentId: string;
    isSubmitted: boolean;
    submittedAt: Date;
  }>;

  const gradeEntryCriteria = [] as Array<{
    id: string;
    gradeEntryId: string;
    criterion: "A" | "B" | "C" | "D";
    score: number;
  }>;

  for (const classSection of classSections) {
    const course = courseById.get(classSection.courseId);
    if (!course) continue;
    const assignments = assignmentsByClassSection.get(classSection.id) ?? [];
    const studentsForGrade = students.filter(
      (student) => student.gradeLevelId === course.gradeLevelId
    );
    const termIndex = terms.findIndex((term) => term.id === classSection.academicTermId);
    const resolvedTermIndex = termIndex < 0 ? 0 : termIndex;

    for (const assignment of assignments) {
      for (const student of studentsForGrade) {
        const base =
          (student.index + course.subjectIndex + resolvedTermIndex + assignment.index) % 8;
        const gradeEntryId = randomUUID();
        gradeEntries.push({
          id: gradeEntryId,
          studentId: student.id,
          assignmentId: assignment.id,
          isSubmitted: true,
          submittedAt: new Date(),
        });

        const criteria = ["A", "B", "C", "D"] as const;
        criteria.forEach((criterion, criterionIndex) => {
          const scoreBase = (base + criterionIndex * 2) % 8;
          gradeEntryCriteria.push({
            id: randomUUID(),
            gradeEntryId,
            criterion,
            score: 1 + scoreBase,
          });
        });
      }
    }
  }

  if (gradeEntries.length) {
    await prisma.gradeEntry.createMany({ data: gradeEntries });
  }

  if (gradeEntryCriteria.length) {
    await prisma.gradeEntryCriterion.createMany({ data: gradeEntryCriteria });
  }

  if (process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD) {
    const passwordHash = await hashPassword(process.env.SEED_ADMIN_PASSWORD);
    await prisma.user.create({
      data: {
        email: process.env.SEED_ADMIN_EMAIL.toLowerCase(),
        passwordHash,
        role: "ADMIN",
        displayName: "Admin",
        organizationId: organization.id,
      },
    });
  }

  return NextResponse.json({ status: "ok", inserted: students.length });
}
