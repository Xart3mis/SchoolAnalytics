import { DefaultProcessor } from "./default.processor.js";

export class ProcessorFactory {
  create(type) {
    void type;
    return new DefaultProcessor();
  }
}
