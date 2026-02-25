import { IDataSource } from "../../../domain/interfaces/data-source.interface.js"

export class ProgressSummarySource extends IDataSource {
  constructor(httpClient) {
    super();
    this.httpClient = httpClient;
  }

  async fetch({
    curriculumProgramId,
    ratingType,
    sourceTitle,
    gradingPeriodId,
    studentIds,
    cursor,
    academicYearId,
    count,
  }) {
    return this.httpClient.get(`/v2/progress-summary`, {
      curriculumProgramId,
      ratingType,
      sourceTitle,
      gradingPeriodId,
      studentIds,
      cursor,
      academicYearId,
      count,
    });
  }
}
