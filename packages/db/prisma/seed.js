/* eslint-disable no-console */
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../../.env"), quiet: true });
dotenv.config({ quiet: true });

const { randomUUID } = require("crypto");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("../src/generated/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
  log: ["error"],
});

const SUBJECTS = [
  { code: "MATH", name: "Mathematics" },
  { code: "ENG", name: "English" },
  { code: "SCI", name: "Science" },
  { code: "HIST", name: "History" },
];

const SEED_STUDENTS = [
  { name: "Avery Chen", gradeLevel: "Grade 9" },
  { name: "Jordan Patel", gradeLevel: "Grade 10" },
  { name: "Riley Morgan", gradeLevel: "Grade 11" },
  { name: "Samira Ali", gradeLevel: "Grade 12" },
  { name: "Evan Brooks", gradeLevel: "Grade 9" },
];

async function main() {
  const q = (id) => `"${String(id).replace(/"/g, '""')}"`;

  for (const { tablename } of await prisma.$queryRawUnsafe(
    `SELECT tablename FROM pg_tables WHERE schemaname='public'`
  )) {
    if (!q(tablename).includes("prisma")) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${q(tablename)} CASCADE;`);
    }
  }

  for (const { relname } of await prisma.$queryRawUnsafe(
    `SELECT c.relname
     FROM pg_class AS c
     JOIN pg_namespace AS n ON c.relnamespace = n.oid
     WHERE c.relkind='S' AND n.nspname='public';`
  )) {
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE ${q(relname)} RESTART WITH 1;`);
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

  const terms = [];
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

  const gradeLevels = [];
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
  const courses = [];
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

  const classSections = [];
  const classSectionsByGradeLevel = new Map();

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
      const existing = classSectionsByGradeLevel.get(course.gradeLevelId) ?? [];
      existing.push(classSection.id);
      classSectionsByGradeLevel.set(course.gradeLevelId, existing);
    }
  }

  const assignmentsByClassSection = new Map();
  for (const classSection of classSections) {
    const course = courseById.get(classSection.courseId);
    if (!course) continue;
    const term = terms.find((t) => t.id === classSection.academicTermId);
    if (!term) continue;
    const assignments = [];
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

  const students = [];
  for (const [index, student] of SEED_STUDENTS.entries()) {
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

  const enrollments = [];
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

  const gradeEntries = [];
  const gradeEntryCriteria = [];

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

        const criteria = ["A", "B", "C", "D"];
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

  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        email: adminEmail.toLowerCase(),
        passwordHash,
        role: "ADMIN",
        displayName: "Admin",
        organizationId: organization.id,
      },
    });
  } else if (adminEmail || adminPassword) {
    console.warn("Seed admin credentials incomplete; skipping admin user creation.");
  }

  console.log(`Seeded ${students.length} students, ${gradeEntries.length} grade entries.`);
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
