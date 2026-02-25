import { IDataSource } from "../../../domain/interfaces/data-source.interface.js"

export class TermGradeSource extends IDataSource {
  constructor(httpClient) {
    super();
    this.httpClient = httpClient;
  }

  async fetch({
    curriculumProgramId,
    academicYearId,
    cursor,
    count,
    criteriaType,
    gradingPeriodId,
    showCategoryDetails,
    studentId,
  }) {
    return this.httpClient.get(`/v2/term-grades`, {
      curriculumProgramId,
      academicYearId,
      cursor,
      count,
      criteriaType,
      gradingPeriodId,
      showCategoryDetails,
      studentId,
    });
  }
}
