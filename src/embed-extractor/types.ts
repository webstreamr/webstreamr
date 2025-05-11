import { StreamWithMeta } from '../types';

export interface EmbedExtractor {
  readonly id: string;

  readonly label: string;

  readonly supports: (url: string) => boolean;

  readonly extract: (url: string, language: string) => Promise<StreamWithMeta>;
}
