import { IDataSource } from "../../../domain/interfaces/data-source.interface.js"

export class GradeSource extends IDataSource {
  constructor(httpClient) {
    super();
    this.httpClient = httpClient;
  }

  async fetch({ curriculumId }) {
    return this.httpClient.get(`/v2/grades`, { curriculumId });
  }
}
