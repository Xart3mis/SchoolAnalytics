import { IDataSource } from "../../../domain/interfaces/data-source.interface.js"

export class FlagTypeSource extends IDataSource {
  constructor(httpClient) {
    super();
    this.httpClient = httpClient;
  }

  async fetch({ isEnabled, curriculums, ids }) {
    return this.httpClient.get(`/v2/flag-types`, { isEnabled, curriculums, ids });
  }
}
