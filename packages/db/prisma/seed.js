/* eslint-disable no-console */
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../../.env"), quiet: true });
dotenv.config({ quiet: true });

const { randomUUID } = require("crypto");
const bcrypt = require("bcrypt");
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
  {
    code: "MATH",
    name: "Mathematics",
    assignmentTypes: ["FORMATIVE", "PROJECT", "SUMMATIVE"],
    topics: ["Patterns", "Algebra", "Modeling", "Data"],
    scoreBias: 1,
  },
  {
    code: "ENG",
    name: "English",
    assignmentTypes: ["FORMATIVE", "PROJECT", "HOMEWORK"],
    topics: ["Argument", "Analysis", "Creative Writing", "Presentation"],
    scoreBias: 0,
  },
  {
    code: "SCI",
    name: "Science",
    assignmentTypes: ["PROJECT", "FORMATIVE", "SUMMATIVE"],
    topics: ["Investigation", "Lab Report", "Systems", "Experiment"],
    scoreBias: 1,
  },
  {
    code: "HIST",
    name: "History",
    assignmentTypes: ["FORMATIVE", "PROJECT", "HOMEWORK"],
    topics: ["Evidence", "Chronology", "Case Study", "Debate"],
    scoreBias: -1,
  },
];

const SEED_STUDENTS = [
  { name: "Avery Chen", gradeLevel: "Grade 9" },
  { name: "Noah Kim", gradeLevel: "Grade 9" },
  { name: "Isla Nguyen", gradeLevel: "Grade 9" },
  { name: "Mateo Rivera", gradeLevel: "Grade 9" },
  { name: "Lina Hassan", gradeLevel: "Grade 9" },
  { name: "Leo Sullivan", gradeLevel: "Grade 9" },
  { name: "Jordan Patel", gradeLevel: "Grade 10" },
  { name: "Mia Torres", gradeLevel: "Grade 10" },
  { name: "Daniel Okafor", gradeLevel: "Grade 10" },
  { name: "Aria Brooks", gradeLevel: "Grade 10" },
  { name: "Ethan Park", gradeLevel: "Grade 10" },
  { name: "Sofia Diaz", gradeLevel: "Grade 10" },
  { name: "Riley Morgan", gradeLevel: "Grade 11" },
  { name: "Owen Campbell", gradeLevel: "Grade 11" },
  { name: "Zara Ibrahim", gradeLevel: "Grade 11" },
  { name: "Lucas Silva", gradeLevel: "Grade 11" },
  { name: "Nina George", gradeLevel: "Grade 11" },
  { name: "Kai Johnson", gradeLevel: "Grade 11" },
  { name: "Samira Ali", gradeLevel: "Grade 12" },
  { name: "Hugo Martin", gradeLevel: "Grade 12" },
  { name: "Priya Shah", gradeLevel: "Grade 12" },
  { name: "Elena Rossi", gradeLevel: "Grade 12" },
  { name: "Adam Clarke", gradeLevel: "Grade 12" },
  { name: "Maya Ahmed", gradeLevel: "Grade 12" },
  { name: "Evan Brooks", gradeLevel: "Grade 9" },
];

const COURSE_VARIANTS = ["Core", "Applied", "Inquiry", "Studio"];
const FEEDBACK_BANK = [
  "Consistent effort with clear growth.",
  "Strong understanding shown in class and tasks.",
  "Improving steadily; next step is deeper analysis.",
  "Good progress, especially in independent work.",
  "Creative thinking stands out in this submission.",
  "Needs more precision, but reasoning is improving.",
  "Confident performance with strong communication.",
  "Developing well; focus on evidence and clarity.",
];

function normalizeSeedEnv(value) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function hashValue(input) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function pickFrom(values, seed) {
  return values[seed % values.length];
}

async function main() {
  await prisma.$executeRaw`
    DO $$
    DECLARE table_name text;
    BEGIN
      FOR table_name IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
          AND tablename NOT LIKE '_prisma%'
      LOOP
        EXECUTE format('TRUNCATE TABLE %I.%I CASCADE', 'public', table_name);
      END LOOP;
    END
    $$;
  `;

  await prisma.$executeRaw`
    DO $$
    DECLARE sequence_name text;
    BEGIN
      FOR sequence_name IN
        SELECT c.relname
        FROM pg_class AS c
        JOIN pg_namespace AS n ON c.relnamespace = n.oid
        WHERE c.relkind = 'S'
          AND n.nspname = 'public'
      LOOP
        EXECUTE format('ALTER SEQUENCE %I.%I RESTART WITH 1', 'public', sequence_name);
      END LOOP;
    END
    $$;
  `;

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
  const coursesPerGrade = 2;
  for (const [gradeIndex, level] of gradeLevels.entries()) {
    for (let slot = 0; slot < coursesPerGrade; slot += 1) {
      const subjectIndex = (gradeIndex + slot * 2) % SUBJECTS.length;
      const subject = SUBJECTS[subjectIndex];
      const variant = COURSE_VARIANTS[(gradeIndex + slot) % COURSE_VARIANTS.length];
      const course = await prisma.course.create({
        data: {
          name: `${subject.name} ${variant}`,
          code: `${subject.code}-${level.name}-${slot + 1}`,
          organizationId: organization.id,
          gradeLevelId: level.id,
        },
      });
      courses.push({
        id: course.id,
        name: course.name,
        code: course.code,
        gradeLevelId: level.id,
        subjectIndex,
        subject,
        courseIndex: courses.length,
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
    const termIndex = terms.findIndex((t) => t.id === classSection.academicTermId);
    const resolvedTermIndex = termIndex < 0 ? 0 : termIndex;
    const assignments = [];
    const assignmentCount = 3 + ((course.courseIndex + resolvedTermIndex) % 3);
    for (let index = 1; index <= assignmentCount; index += 1) {
      const dueDate = new Date(term.startDate.getTime() + (5 + index * 9) * 24 * 60 * 60 * 1000);
      const topic = pickFrom(course.subject.topics, course.courseIndex + index + resolvedTermIndex);
      const assignmentType = pickFrom(
        course.subject.assignmentTypes,
        resolvedTermIndex + index + course.subjectIndex
      );
      const maxScore = 6 + ((course.subjectIndex + index + resolvedTermIndex) % 3);
      const created = await prisma.assignment.create({
        data: {
          classSectionId: classSection.id,
          title: `${course.code} ${topic} ${resolvedTermIndex + 1}.${index}`,
          type: assignmentType,
          dueDate,
          maxScore,
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
        const entrySeed = `${student.id}:${assignment.id}:${course.id}:${resolvedTermIndex}`;
        const seed = hashValue(entrySeed);
        const performanceBand = (student.index * 5 + course.courseIndex * 3 + resolvedTermIndex) % 6;
        const scoreBase = 2 + performanceBand + course.subject.scoreBias;
        const gradeEntryId = randomUUID();
        const score = clamp(scoreBase + ((seed % 5) - 2), 1, 8);
        const grade =
          score >= 7 ? "A" : score >= 5 ? "B" : score >= 3 ? "C" : score >= 2 ? "D" : "E";
        gradeEntries.push({
          id: gradeEntryId,
          studentId: student.id,
          assignmentId: assignment.id,
          score,
          grade,
          feedback: pickFrom(FEEDBACK_BANK, seed),
          isSubmitted: true,
          submittedAt: new Date(Date.UTC(2026, resolvedTermIndex * 3 + 1, (seed % 24) + 1)),
        });

        const criteria = ["A", "B", "C", "D"];
        criteria.forEach((criterion, criterionIndex) => {
          const criterionSeed = hashValue(`${entrySeed}:${criterion}`);
          const criterionScore = clamp(
            score +
              criterionIndex -
              1 +
              ((criterionSeed % 3) - 1) +
              ((course.subjectIndex + resolvedTermIndex) % 2),
            1,
            8
          );
          gradeEntryCriteria.push({
            id: randomUUID(),
            gradeEntryId,
            criterion,
            score: criterionScore,
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

  const adminEmailRaw = normalizeSeedEnv(process.env.SEED_ADMIN_EMAIL);
  const adminPassword = normalizeSeedEnv(process.env.SEED_ADMIN_PASSWORD);
  const adminEmail = adminEmailRaw?.toLowerCase();
  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.upsert({
      where: { email: adminEmail },
      create: {
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
        displayName: "Admin",
        organizationId: organization.id,
      },
      update: {
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
