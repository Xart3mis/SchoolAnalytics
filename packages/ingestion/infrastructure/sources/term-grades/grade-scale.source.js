import { IDataSource } from "../../../domain/interfaces/data-source.interface.js"

export class GradeScaleSource extends IDataSource {
  constructor(httpClient) {
    super();
    this.httpClient = httpClient;
  }

  async fetch({ curriculumProgramId }) {
    return this.httpClient.get(`/v2/grade-scale`, { curriculumProgramId });
  }
}
