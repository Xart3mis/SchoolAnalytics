export class IDataProcessor {
  clean(data) { throw new Error("Not implemented"); }
  get schema() { throw new Error("Schema not defined"); } // Zod Schema
  transform(data) { throw new Error("Not implemented"); }
}
