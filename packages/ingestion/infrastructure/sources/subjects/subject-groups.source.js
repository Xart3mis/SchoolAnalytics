import { IDataSource } from "../../../domain/interfaces/data-source.interface.js"

export class SubjectGroupSource extends IDataSource {
  constructor(httpClient) {
    super();
    this.httpClient = httpClient;
  }

  async fetch({ curriculumId }) {
    return this.httpClient.get(`/v2/org-subject-groups/${curriculumId}`);
  }
}
