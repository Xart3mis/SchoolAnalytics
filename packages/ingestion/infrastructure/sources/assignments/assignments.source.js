import { IDataSource } from "../../../domain/interfaces/data-source.interface.js"

export class AssignmentSource extends IDataSource {
  constructor(httpClient) {
    super();
    this.httpClient = httpClient;
  }

  async fetch({ curriculumProgramId, classIds, teacherCourseIds, assignmentId, academicYearId, count, cursor }) {
    return this.httpClient.get(`/v2/assignments`, {
      curriculumProgramId,
      classIds,
      teacherCourseIds,
      assignmentId,
      academicYearId,
      count,
      cursor,
    });
  }
}
