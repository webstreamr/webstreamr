import { ContentType, Stream } from 'stremio-addon-sdk';

export type HandlerStream = Stream & { resolution: string; size: string };

export type Handler = (args: { type: ContentType; id: string }) => Promise<(HandlerStream)[]>;
