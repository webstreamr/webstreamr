import winston from 'winston';
import { MostraGuarda } from './MostraGuarda';
import { Fetcher } from '../utils';
import { ExtractorRegistry } from '../extractor';
import { Context } from '../types';
jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const handler = new MostraGuarda(fetcher, new ExtractorRegistry(logger, fetcher));
const ctx: Context = { ip: '127.0.0.1' };

describe('MostraGuarda', () => {
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
      sourceId: 'supervideo_it',
      height: 720,
      bytes: 1181116006,
      countryCode: 'it',
    });
    expect(streams[0]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
    expect(streams[1]).toStrictEqual({
      url: expect.any(URL),
      label: 'Dropload',
      sourceId: 'dropload_it',
      height: 720,
      bytes: 1181116006,
      countryCode: 'it',
    });
    expect(streams[1]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
    expect(streams[2]).toStrictEqual({
      url: expect.any(URL),
      label: 'DoodStream',
      sourceId: 'doodstream_it',
      height: 0,
      bytes: 0,
      countryCode: 'it',
      requestHeaders: {
        Referer: 'http://dood.to/',
      },
    });
    expect(streams[2]?.url.href).toMatch(/^https:\/\/.*?token.*?expiry/);
  });
});
