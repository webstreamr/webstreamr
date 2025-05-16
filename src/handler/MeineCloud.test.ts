import winston from 'winston';
import { MeineCloud } from './MeineCloud';
import { Fetcher } from '../utils';
import { EmbedExtractorRegistry } from '../embed-extractor';
import { Context } from '../types';
jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const handler = new MeineCloud(fetcher, new EmbedExtractorRegistry(logger, fetcher));
const ctx: Context = { ip: '127.0.0.1' };

describe('MeineCloud', () => {
  test('does not handle non imdb movies', async () => {
    const streams = await handler.handle(ctx, 'movie', 'kitsu:123');

    expect(streams).toHaveLength(0);
  });

  test('handles non-existent movies gracefully', async () => {
    const streams = await handler.handle(ctx, 'movie', 'tt12345678');

    expect(streams).toHaveLength(0);
  });

  test('handle imdb the devil\'s bath', async () => {
    const streams = (await handler.handle(ctx, 'movie', 'tt29141112')).filter(stream => stream !== undefined);

    expect(streams).toHaveLength(3);
    expect(streams[0]).toStrictEqual({
      url: expect.any(URL),
      label: 'SuperVideo',
      sourceId: 'supervideo_de',
      height: 720,
      bytes: 1073741824,
      countryCode: 'de',
    });
    expect(streams[0]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
    expect(streams[1]).toStrictEqual({
      url: expect.any(URL),
      label: 'Dropload',
      sourceId: 'dropload_de',
      height: 1080,
      bytes: 1395864371,
      countryCode: 'de',
    });
    expect(streams[1]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
    expect(streams[2]).toStrictEqual({
      url: expect.any(URL),
      label: 'DoodStream',
      sourceId: 'doodstream_de',
      height: 0,
      bytes: 0,
      countryCode: 'de',
      requestHeaders: {
        Referer: 'http://dood.to/',
      },
    });
    expect(streams[2]?.url.href).toMatch(/^https:\/\/.*?token.*?expiry/);
  });
});
