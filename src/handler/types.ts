import { StreamWithMeta } from '../types';

export interface Handler {
  readonly id: string;

  readonly label: string;

  readonly contentTypes: string[];

  readonly languages: string[];

  readonly handle: (id: string) => Promise<StreamWithMeta[]>;
}
