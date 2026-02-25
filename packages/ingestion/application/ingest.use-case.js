export class IngestDataUseCase {
  async execute(source, processor, params) {
    const rawData = await source.fetch(params);

    const clean = processor.clean(rawData);
    const valid = processor.schema.parse(clean);

    return processor.transform(valid);
  }
}
