import { IDataSource } from "../../../domain/interfaces/data-source.interface.js"

export class CourseSource extends IDataSource {
  constructor(httpClient) {
    super();
    this.httpClient = httpClient;
  }

  async fetch({ curriculumId, courseIds }) {
    return this.httpClient.get(`/v2/courses`, { curriculumId, courseIds });
  }
}
