export class IDataSource {
  fetch(params: any): Promise<any>;
}

export class IHttpClient {
  get(url: string, headers?: Record<string, any>): Promise<any>;
}

export class IDataProcessor {
  clean(data: any): any;
  readonly schema: { parse(data: any): any };
  transform(data: any): any;
}
