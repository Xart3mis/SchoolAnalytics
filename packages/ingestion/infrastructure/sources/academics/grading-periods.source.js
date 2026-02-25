import { IDataSource } from "../../../domain/interfaces/data-source.interface.js"

export class GradingPeriodSource extends IDataSource {
  constructor(httpClient) {
    super();
    this.httpClient = httpClient;
  }

  async fetch({ curriculumProgramId, academicYearId }) {
    return this.httpClient.get(`/v2/grading-periods`, { curriculumProgramId, academicYearId });
  }
}
