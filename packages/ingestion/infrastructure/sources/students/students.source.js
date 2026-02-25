import { IDataSource } from "../../../domain/interfaces/data-source.interface.js"

export class StudentSource extends IDataSource {
  constructor(httpClient) {
    super();
    this.httpClient = httpClient;
  }

  async fetch({ curriculumId, studentIds, sourceIds, pageNumber, pageSize, getFutureAyStudents }) {
    return this.httpClient.get(`/v2/students`, {
      curriculumId,
      studentIds,
      sourceIds,
      pageNumber,
      pageSize,
      getFutureAyStudents,
    });
  }
}
