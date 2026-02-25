import { AcademicYearSource } from "./academics/academic-years.source.js"
import { CurriculumSource } from "./academics/curriculum.source.js"
import { GradeSource } from "./academics/grades.source.js"
import { GradingPeriodSource } from "./academics/grading-periods.source.js"
import { OrgRoleSource } from "./academics/org-roles.source.js"
import { YearGroupSource } from "./academics/year-groups.source.js"
import { AssignmentByIdSource } from "./assignments/assignment-by-id.source.js"
import { AssignmentSource } from "./assignments/assignments.source.js"
import { StudentAssignmentByStudentIdSource } from "./assignments/student-assignment-by-student-id.source.js"
import { StudentAssignmentSource } from "./assignments/student-assignments.source.js"
import { CourseStudentSource } from "./course/course-students.source.js"
import { CourseSource } from "./course/courses.source.js"
import { ProgressSummarySource } from "./gradebook/progress-summary.source.js"
import { FlagTypeSource } from "./student-flags/flag-types.source.js"
import { StudentFlagSource } from "./student-flags/student-flag.source.js"
import { StudentOtherInfoSource } from "./students/student-other-info.source.js"
import { StudentSource } from "./students/students.source.js"
import { TeacherNoteForStudentSource } from "./students/teacher-notes-for-student.source.js"
import { SubjectGroupSource } from "./subjects/subject-groups.source.js"
import { SubjectSource } from "./subjects/subjects.source.js"
import { GradeScaleSource } from "./term-grades/grade-scale.source.js"
import { TermGradeSource } from "./term-grades/term-grades.source.js"

export class SourceFactory {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  create(type) {
    const sources = {
      "academic-years": new AcademicYearSource(this.httpClient),
      "curriculum": new CurriculumSource(this.httpClient),
      "grades": new GradeSource(this.httpClient),
      "grading-periods": new GradingPeriodSource(this.httpClient),
      "org-roles": new OrgRoleSource(this.httpClient),
      "year-groups": new YearGroupSource(this.httpClient),
      "assignment-by-id": new AssignmentByIdSource(this.httpClient),
      "assignments": new AssignmentSource(this.httpClient),
      "student-assignment-by-student-id": new StudentAssignmentByStudentIdSource(this.httpClient),
      "student-assignments": new StudentAssignmentSource(this.httpClient),
      "course-students": new CourseStudentSource(this.httpClient),
      "courses": new CourseSource(this.httpClient),
      "progress-summary": new ProgressSummarySource(this.httpClient),
      "flag-types": new FlagTypeSource(this.httpClient),
      "student-flag": new StudentFlagSource(this.httpClient),
      "student-other-info": new StudentOtherInfoSource(this.httpClient),
      "students": new StudentSource(this.httpClient),
      "teacher-notes-for-student": new TeacherNoteForStudentSource(this.httpClient),
      "subject-groups": new SubjectGroupSource(this.httpClient),
      "subjects": new SubjectSource(this.httpClient),
      "grade-scale": new GradeScaleSource(this.httpClient),
      "term-grades": new TermGradeSource(this.httpClient),
    };

    const source = sources[type];
    if (!source) throw new Error(`Unsupported source type: ${type}`);
    return source;
  }
}
