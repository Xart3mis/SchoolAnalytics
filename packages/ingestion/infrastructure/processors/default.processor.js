import * as z from "zod";
import { IDataProcessor } from "../../domain/interfaces/processor.interface.js";

export class DefaultProcessor extends IDataProcessor {
  clean(data) {
    return data;
  }

  get schema() {
    return z.any();
  }

  transform(data) {
    return data;
  }
}
