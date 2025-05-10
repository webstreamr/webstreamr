import { StreamWithMeta } from '../types';

export interface EmbedExtractor {
  readonly id: string;

  readonly label: string;

  readonly extract: (embedUrl: string, language: string) => Promise<StreamWithMeta>;
}
