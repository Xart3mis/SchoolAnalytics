import { IDataSource } from "../../../domain/interfaces/data-source.interface.js"

export class AcademicYearSource extends IDataSource {
  constructor(httpClient) {
    super();
    this.httpClient = httpClient;
  }

  async fetch({}) {
    return this.httpClient.get(`/v2/academic-years`);
  }
}
