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

const DEFAULT_SUBJECT_PROFILE = {
  assignmentTypes: ["FORMATIVE", "PROJECT", "SUMMATIVE"],
  topics: ["Practice", "Investigation", "Application", "Reflection"],
  scoreBias: 0,
};

const SUBJECT_PROFILE_OVERRIDES = {
  Mathematics: {
    assignmentTypes: ["FORMATIVE", "SUMMATIVE", "PROJECT"],
    topics: ["Patterns", "Algebra", "Modeling", "Data"],
    scoreBias: 1,
  },
  Maths: {
    assignmentTypes: ["FORMATIVE", "SUMMATIVE", "PROJECT"],
    topics: ["Patterns", "Algebra", "Modeling", "Data"],
    scoreBias: 1,
  },
  Sciences: {
    assignmentTypes: ["FORMATIVE", "PROJECT", "SUMMATIVE"],
    topics: ["Investigation", "Lab Report", "Systems", "Experiment"],
    scoreBias: 1,
  },
  "English Language & Literature": {
    assignmentTypes: ["FORMATIVE", "PROJECT", "HOMEWORK"],
    topics: ["Argument", "Analysis", "Creative Writing", "Presentation"],
    scoreBias: 0,
  },
  "Arabic Language & Literature": {
    assignmentTypes: ["FORMATIVE", "PROJECT", "HOMEWORK"],
    topics: ["Reading", "Analysis", "Composition", "Presentation"],
    scoreBias: 0,
  },
  "Individuals and Societies (IS)": {
    assignmentTypes: ["FORMATIVE", "PROJECT", "HOMEWORK"],
    topics: ["Evidence", "Chronology", "Case Study", "Debate"],
    scoreBias: -1,
  },
  "Social Studies": {
    assignmentTypes: ["FORMATIVE", "PROJECT", "HOMEWORK"],
    topics: ["Evidence", "Chronology", "Case Study", "Debate"],
    scoreBias: -1,
  },
};

const ACADEMIC_YEARS = [
  { name: "2024-2025", startDate: "2024-08-15", endDate: "2025-06-15" },
  { name: "2023-2024", startDate: "2023-08-15", endDate: "2024-06-15" },
  { name: "2025-2026", startDate: "2025-08-15", endDate: "2026-06-15" },
];

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

function logProgress(message) {
  const timestamp = new Date().toISOString();
  console.log(`[seed ${timestamp}] ${message}`);
}

function sanitizeIdentifier(input, fallback = "X") {
  const normalized = input.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return normalized || fallback;
}

function splitNameParts(fullName) {
  const cleaned = fullName.replace(/\s+/g, " ").trim();
  if (!cleaned) return { firstName: null, lastName: null };
  const [firstName, ...lastNameParts] = cleaned.split(" ");
  return {
    firstName: firstName || null,
    lastName: lastNameParts.join(" ") || null,
  };
}

function resolveSubjectProfile(subjectName) {
  return SUBJECT_PROFILE_OVERRIDES[subjectName] ?? DEFAULT_SUBJECT_PROFILE;
}

function buildCohortStudents(grade, section, count) {
  const firstNames = [
    "Avery",
    "Noah",
    "Isla",
    "Mateo",
    "Lina",
    "Leo",
    "Jordan",
    "Mia",
    "Daniel",
    "Aria",
    "Ethan",
    "Sofia",
    "Riley",
    "Owen",
    "Zara",
    "Lucas",
    "Nina",
    "Kai",
    "Samira",
    "Hugo",
    "Priya",
    "Elena",
    "Adam",
    "Maya",
    "Evan",
    "Yara",
    "Tariq",
    "Layla",
    "Omar",
    "Jana",
  ];
  const lastNames = [
    "Chen",
    "Kim",
    "Nguyen",
    "Rivera",
    "Hassan",
    "Sullivan",
    "Patel",
    "Torres",
    "Okafor",
    "Brooks",
    "Park",
    "Diaz",
    "Morgan",
    "Campbell",
    "Ibrahim",
    "Silva",
    "George",
    "Johnson",
    "Ali",
    "Martin",
    "Shah",
    "Rossi",
    "Clarke",
    "Ahmed",
    "Baker",
    "Khan",
    "Rahman",
    "Saad",
    "Mansour",
    "Fahmy",
  ];
  return Array.from({ length: count }, (_, index) => {
    const first = pickFrom(firstNames, grade * 13 + section.charCodeAt(0) + index);
    const last = pickFrom(lastNames, grade * 17 + section.charCodeAt(0) + index * 3);
    return `${first} ${last} ${grade}${section}`;
  });
}

function buildLmsStyleTemplates() {
  const cohorts = [
    { grade: 1, section: "A", size: 18 },
    { grade: 1, section: "B", size: 18 },
    { grade: 2, section: "A", size: 16 },
    { grade: 2, section: "B", size: 16 },
    { grade: 3, section: "A", size: 16 },
    { grade: 3, section: "B", size: 12 },
    { grade: 4, section: "A", size: 17 },
    { grade: 5, section: "A", size: 14 },
  ];

  const subjectRows = [
    { suffix: "Arabic", subject: "Arabic Language & Literature", subjectGroup: "Language and literature" },
    {
      suffix: "English Language & Literature",
      subject: "English Language & Literature",
      subjectGroup: "Language and literature",
    },
    { suffix: "Sciences", subject: "Sciences", subjectGroup: "Sciences" },
    { suffix: "Maths", subject: "Maths", subjectGroup: "Mathematics" },
    { suffix: "Individuals and Societies", subject: "Individuals and Societies (IS)", subjectGroup: "Individuals and societies" },
    { suffix: "Digital Design", subject: "Digital Design", subjectGroup: "Design" },
    { suffix: "Product Design", subject: "Product Design", subjectGroup: "Design" },
    { suffix: "Drama", subject: "Drama", subjectGroup: "Arts" },
    { suffix: "Art", subject: "Visual Arts", subjectGroup: "Arts" },
    {
      suffix: "Physical and Health Education",
      subject: "Physical and Health Education (PHE)",
      subjectGroup: "Physical and health education",
    },
    { suffix: "French", subject: "Language Acquisition (FRENCH)", subjectGroup: "Language acquisition" },
    { suffix: "German", subject: "Language Acquisition (GERMAN)", subjectGroup: "Language acquisition" },
    { suffix: "Religion", subject: "Religion", subjectGroup: "Individuals and societies" },
  ];

  const templates = [];
  for (const cohort of cohorts) {
    const classPrefix = `MYP ${cohort.grade}${cohort.section}`;
    const cohortStudents = buildCohortStudents(cohort.grade, cohort.section, cohort.size);
    for (const row of subjectRows) {
      templates.push({
        className: `${classPrefix} ${row.suffix}`,
        subjectName: row.subject,
        subjectGroup: row.subjectGroup,
        classId: `TDC-${sanitizeIdentifier(`${classPrefix}-${row.suffix}`)}`,
        grades: [cohort.grade],
        students: cohortStudents,
        subjectProfile: resolveSubjectProfile(row.subject),
      });
    }

    for (const lang of ["French", "German"]) {
      templates.push({
        className: `${classPrefix} ${lang} Support`,
        subjectName: `Language Acquisition (${lang.toUpperCase()})`,
        subjectGroup: "Language acquisition",
        classId: `TDC-${sanitizeIdentifier(`${classPrefix}-${lang}-Support`)}`,
        grades: [cohort.grade],
        students: [],
        subjectProfile: resolveSubjectProfile(`Language Acquisition (${lang.toUpperCase()})`),
      });
    }
  }

  const allStudents = Array.from(new Set(templates.flatMap((template) => template.students)));
  templates.push(
    {
      className: "Arabic Language For Foreigners",
      subjectName: "Arabic Language & Literature",
      subjectGroup: "Language and literature",
      classId: "TDC-ARABIC-FOREIGNERS",
      grades: [1, 2, 3, 4, 5],
      students: [],
      subjectProfile: resolveSubjectProfile("Arabic Language & Literature"),
    },
    {
      className: "ATLs",
      subjectName: "English Language & Literature",
      subjectGroup: "Language and literature",
      classId: "TDC-ATLS",
      grades: [1, 2, 3, 4, 5],
      students: allStudents.slice(0, 20),
      subjectProfile: resolveSubjectProfile("English Language & Literature"),
    },
    {
      className: "English Remedial Class",
      subjectName: "English Language & Literature",
      subjectGroup: "Language and literature",
      classId: "TDC-ENGLISH-REMEDIAL",
      grades: [1, 2, 3, 4, 5],
      students: allStudents.filter((_, index) => index % 9 === 0),
      subjectProfile: resolveSubjectProfile("English Language & Literature"),
    }
  );

  return templates;
}

async function main() {
  const startedAt = Date.now();
  logProgress("Starting seed run...");

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
  logProgress("Truncated public tables.");

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
  logProgress("Reset public sequences.");

  const organization = await prisma.organization.create({
    data: { name: "Sample School" },
  });
  logProgress(`Created organization: ${organization.name}`);

  const terms = [];
  for (const academicYearSeed of ACADEMIC_YEARS) {
    const academicYear = await prisma.academicYear.create({
      data: {
        name: academicYearSeed.name,
        startDate: new Date(academicYearSeed.startDate),
        endDate: new Date(academicYearSeed.endDate),
        organizationId: organization.id,
      },
    });
    const startYear = Number(academicYearSeed.name.slice(0, 4));
    const termDefinitions = [
      { name: "T1", startDate: new Date(`${startYear}-08-15`), endDate: new Date(`${startYear}-11-30`) },
      { name: "T2", startDate: new Date(`${startYear}-12-01`), endDate: new Date(`${startYear + 1}-03-15`) },
      { name: "T3", startDate: new Date(`${startYear + 1}-03-16`), endDate: new Date(`${startYear + 1}-06-15`) },
    ];

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
    logProgress(`Created academic year ${academicYearSeed.name} with 3 terms.`);
  }
  logProgress(`Total terms created: ${terms.length}`);

  const gradeLevels = [];
  for (const grade of [1, 2, 3, 4, 5]) {
    gradeLevels.push(
      await prisma.gradeLevel.create({
        data: {
          name: String(grade),
        },
      })
    );
  }
  logProgress(`Created grade levels: ${gradeLevels.map((level) => level.name).join(", ")}`);

  const gradeLevelByName = new Map(gradeLevels.map((level) => [level.name, level]));
  const lmsTemplates = buildLmsStyleTemplates();
  logProgress(`Loaded ${lmsTemplates.length} in-code LMS-style class templates.`);
  const courseCatalog = new Map();
  const courses = [];

  for (const template of lmsTemplates) {
    const singleGrade = template.grades.length === 1 ? template.grades[0] : null;
    const gradeLevelId = singleGrade ? gradeLevelByName.get(String(singleGrade))?.id ?? null : null;
    const courseKey = `${template.subjectName}::${gradeLevelId ?? "MIXED"}`;
    if (courseCatalog.has(courseKey)) continue;
    const course = await prisma.course.create({
      data: {
        name: template.subjectName,
        code: `${sanitizeIdentifier(template.subjectName).slice(0, 16)}-${gradeLevelId ?? "MX"}`,
        organizationId: organization.id,
        gradeLevelId,
      },
    });
    courseCatalog.set(courseKey, course.id);
    courses.push({
      id: course.id,
      name: template.subjectName,
      gradeLevelId,
      subjectIndex: courses.length,
      subject: template.subjectProfile,
      courseIndex: courses.length,
    });
  }
  logProgress(`Created ${courses.length} courses from templates.`);

  const courseById = new Map(courses.map((course) => [course.id, course]));

  const studentsByName = new Map();
  const studentSeedList = Array.from(
    new Set(
      lmsTemplates
        .flatMap((template) => template.students)
        .map((name) => name.trim())
        .filter(Boolean)
    )
  );

  for (const [index, fullName] of studentSeedList.entries()) {
    const normalized = fullName.replace(/\s+/g, " ").trim();
    const matchedTemplate = lmsTemplates.find(
      (template) => template.students.includes(normalized) && template.grades.length === 1
    );
    const gradeLevel = matchedTemplate
      ? gradeLevelByName.get(String(matchedTemplate.grades[0])) ?? null
      : null;
    const nameParts = splitNameParts(normalized);
    const user = await prisma.user.create({
      data: {
        email: `student_${sanitizeIdentifier(normalized).toLowerCase()}_${index + 1}@example.com`,
        role: "STUDENT",
        displayName: normalized,
        organizationId: organization.id,
      },
    });

    const studentRecord = await prisma.student.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        firstName: nameParts.firstName,
        lastName: nameParts.lastName,
      },
    });

    studentsByName.set(normalized, {
      id: studentRecord.id,
      gradeLevelId: gradeLevel?.id ?? null,
      index,
    });
  }
  logProgress(`Created ${studentsByName.size} students from template rosters.`);
  const studentById = new Map(Array.from(studentsByName.values()).map((student) => [student.id, student]));

  const classSections = [];
  const enrollmentRows = [];
  const studentsByClassSectionId = new Map();

  for (const term of terms) {
    for (const template of lmsTemplates) {
      const singleGrade = template.grades.length === 1 ? template.grades[0] : null;
      const gradeLevelId = singleGrade ? gradeLevelByName.get(String(singleGrade))?.id ?? null : null;
      const courseKey = `${template.subjectName}::${gradeLevelId ?? "MIXED"}`;
      const courseId = courseCatalog.get(courseKey);
      if (!courseId) continue;

      const classSection = await prisma.classSection.create({
        data: {
          name: template.className,
          organizationId: organization.id,
          courseId,
          academicYearId: term.academicYearId,
          academicTermId: term.id,
          rawSourceData: {
            classId: template.classId,
            className: template.className,
            subject: template.subjectName,
            subjectGroup: template.subjectGroup,
            grades: template.grades,
          },
        },
      });
      classSections.push({
        id: classSection.id,
        courseId,
        academicTermId: term.id,
      });

      const enrolledStudentIds = [];
      for (const studentName of template.students) {
        const student = studentsByName.get(studentName.trim());
        if (!student) continue;
        enrolledStudentIds.push(student.id);
        enrollmentRows.push({
          classSectionId: classSection.id,
          studentId: student.id,
          role: "STUDENT",
        });
      }
      studentsByClassSectionId.set(classSection.id, enrolledStudentIds);
    }
    logProgress(`Created class sections for term ${term.name} (${term.id.slice(0, 8)}...).`);
  }
  logProgress(`Created ${classSections.length} class sections across all terms.`);

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
  logProgress("Created assignments for all class sections.");

  if (enrollmentRows.length) {
    await prisma.enrollment.createMany({ data: enrollmentRows, skipDuplicates: true });
  }
  logProgress(`Inserted ${enrollmentRows.length} enrollments.`);

  const gradeEntries = [];
  const gradeEntryCriteria = [];

  for (const classSection of classSections) {
    const course = courseById.get(classSection.courseId);
    if (!course) continue;
    const term = terms.find((t) => t.id === classSection.academicTermId);
    if (!term) continue;
    const assignments = assignmentsByClassSection.get(classSection.id) ?? [];
    const studentsForClass = (studentsByClassSectionId.get(classSection.id) ?? [])
      .map((studentId) => {
        const match = studentById.get(studentId);
        return match ? { id: studentId, index: match.index } : null;
      })
      .filter(Boolean);
    const termIndex = terms.findIndex((term) => term.id === classSection.academicTermId);
    const resolvedTermIndex = termIndex < 0 ? 0 : termIndex;

    for (const assignment of assignments) {
      for (const student of studentsForClass) {
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
          submittedAt: new Date(term.startDate.getTime() + ((seed % 28) + 1) * 24 * 60 * 60 * 1000),
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
  logProgress(`Inserted ${gradeEntries.length} grade entries.`);

  if (gradeEntryCriteria.length) {
    await prisma.gradeEntryCriterion.createMany({ data: gradeEntryCriteria });
  }
  logProgress(`Inserted ${gradeEntryCriteria.length} grade entry criteria.`);

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

  const durationSeconds = ((Date.now() - startedAt) / 1000).toFixed(2);
  logProgress(
    `Done. Seeded ${studentsByName.size} students, ${classSections.length} class sections, ${gradeEntries.length} grade entries in ${durationSeconds}s.`
  );
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
