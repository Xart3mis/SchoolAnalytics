import { IDataSource } from "../../../domain/interfaces/data-source.interface.js"

export class StudentOtherInfoSource extends IDataSource {
  constructor(httpClient) {
    super();
    this.httpClient = httpClient;
  }

  async fetch({ id }) {
    return this.httpClient.get(`/v2/students/${id}/other-info`);
  }
}
