import { IDataSource } from "../../../domain/interfaces/data-source.interface.js"

export class OrgRoleSource extends IDataSource {
  constructor(httpClient) {
    super();
    this.httpClient = httpClient;
  }

  async fetch({ roleId, roleLevels }) {
    return this.httpClient.get(`/v2/org-roles`, { roleId, roleLevels });
  }
}
