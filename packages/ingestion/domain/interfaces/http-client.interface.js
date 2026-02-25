export class IHttpClient {
  constructor(baseURL, token) {
    if (new.target === IHttpClient) {
      throw new Error("Method 'constructor()' must be implemented.");
    }
  }
  async get(url, options) {
    throw new Error("Method 'get()' must be implemented.");
  }
}
