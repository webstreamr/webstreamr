import winston from 'winston';
import { FrenchCloud } from './FrenchCloud';
import { Fetcher } from '../utils';
import { EmbedExtractorRegistry } from '../embed-extractor';
import { Context } from '../types';
jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const handler = new FrenchCloud(fetcher, new EmbedExtractorRegistry(logger, fetcher));
const ctx: Context = { ip: '127.0.0.1' };

describe('FrenchCloud', () => {
  test('does not handle non imdb movies', async () => {
    const streams = await handler.handle(ctx, 'kitsu:123');

    expect(streams).toHaveLength(0);
  });

  test('handles non-existent movies gracefully', async () => {
    const streams = await handler.handle(ctx, 'tt12345678');

    expect(streams).toHaveLength(0);
  });

  test('handle imdb the devil\'s bath', async () => {
    const streams = (await handler.handle(ctx, 'tt29141112')).filter(stream => stream !== undefined);

    expect(streams).toHaveLength(2);
    expect(streams[0]).toStrictEqual({
      url: expect.any(URL),
      label: 'SuperVideo',
      sourceId: 'supervideo_fr',
      height: 720,
      bytes: 966682214,
      countryCode: 'fr',
    });
    expect(streams[0]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
    expect(streams[1]).toStrictEqual({
      url: expect.any(URL),
      label: 'Dropload',
      sourceId: 'dropload_fr',
      height: 720,
      bytes: 966682214,
      countryCode: 'fr',
    });
    expect(streams[1]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
  });
});
