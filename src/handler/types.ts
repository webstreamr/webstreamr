import { Stream } from 'stremio-addon-sdk';

export type HandlerStream = Stream & { resolution: string | undefined; size: string | undefined };

export interface Handler {
  readonly id: string;

  readonly label: string;

  readonly contentTypes: string[];

  readonly languages: string[];

  readonly handle: (id: string) => Promise<HandlerStream[]>;
}
