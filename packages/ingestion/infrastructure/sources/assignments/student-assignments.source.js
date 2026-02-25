import { IDataSource } from "../../../domain/interfaces/data-source.interface.js"

export class StudentAssignmentSource extends IDataSource {
  constructor(httpClient) {
    super();
    this.httpClient = httpClient;
  }

  async fetch({ curriculumProgramId, assignmentIds, studentIds, count, cursor }) {
    return this.httpClient.get(`/v2/student-assignments`, {
      curriculumProgramId,
      assignmentIds,
      studentIds,
      count,
      cursor,
    });
  }
}
