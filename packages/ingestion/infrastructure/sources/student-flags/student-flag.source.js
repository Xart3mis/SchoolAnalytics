import { IDataSource } from "../../../domain/interfaces/data-source.interface.js"

export class StudentFlagSource extends IDataSource {
  constructor(httpClient) {
    super();
    this.httpClient = httpClient;
  }

  async fetch({ studentIds, flagTypeIds, activeOnly, first, after }) {
    return this.httpClient.get(`/v2/student-flags`, { studentIds, flagTypeIds, activeOnly, first, after });
  }
}
