export class AxiosHttpClient {
  get(url: string, headers?: Record<string, any>): Promise<any>;
}

export class DefaultProcessor {
  clean(data: any): any;
  readonly schema: { parse(data: any): any };
  transform(data: any): any;
}

export class ProcessorFactory {
  create(type: string): any;
}

export class SourceFactory {
  constructor(httpClient: any);
  create(type: string): any;
}
