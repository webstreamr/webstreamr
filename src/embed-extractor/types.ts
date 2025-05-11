import { StreamWithMeta } from '../types';

export interface EmbedExtractor {
  readonly id: string;

  readonly label: string;

  readonly supports: (url: URL) => boolean;

  readonly extract: (url: URL, language: string) => Promise<StreamWithMeta>;
}
