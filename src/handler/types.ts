import { Context, UrlResult } from '../types';

export interface Handler {
  readonly id: string;

  readonly label: string;

  readonly contentTypes: string[];

  readonly languages: string[];

  readonly handle: (ctx: Context, type: string, id: string) => Promise<(UrlResult | undefined)[]>;
}
