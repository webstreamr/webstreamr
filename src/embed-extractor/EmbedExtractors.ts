import { EmbedExtractor } from './types';
import { Context, StreamWithMeta } from '../types';

export class EmbedExtractors {
  private readonly embedExtractors: EmbedExtractor[];

  constructor(embedExtractors: EmbedExtractor[]) {
    this.embedExtractors = embedExtractors;
  }

  readonly handle = async (ctx: Context, url: URL, language: string): Promise<StreamWithMeta> => {
    const embedExtractor = this.embedExtractors.find(embedExtractor => embedExtractor.supports(url));

    if (undefined === embedExtractor) {
      throw new Error(`No embed extractor found that supports url ${url}`);
    }

    return embedExtractor.extract(ctx, url, language);
  };
}
