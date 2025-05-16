import winston from 'winston';
import { VerHdLink } from './VerHdLink';
import { Fetcher } from '../utils';
import { ExtractorRegistry } from '../extractor';
import { Context } from '../types';
jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const handler = new VerHdLink(fetcher, new ExtractorRegistry(logger, fetcher));
const ctx: Context = { ip: '127.0.0.1' };

describe('VerHdLink', () => {
  test('does not handle non imdb movies', async () => {
    const streams = await handler.handle(ctx, 'movie', 'kitsu:123');

    expect(streams).toHaveLength(0);
  });

  test('handles non-existent movies gracefully', async () => {
    const streams = await handler.handle(ctx, 'movie', 'tt12345678');

    expect(streams).toHaveLength(0);
  });

  test('handle mickey 17', async () => {
    const streams = (await handler.handle(ctx, 'movie', 'tt12299608')).filter(stream => stream !== undefined);

    expect(streams).toHaveLength(8);
    expect(streams[0]).toStrictEqual({
      url: expect.any(URL),
      label: 'SuperVideo',
      sourceId: 'supervideo_mx',
      height: 720,
      bytes: 1288490188,
      countryCode: 'mx',
    });
    expect(streams[0]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
    expect(streams[1]).toStrictEqual({
      url: expect.any(URL),
      label: 'Dropload',
      sourceId: 'dropload_mx',
      height: 720,
      bytes: 1181116006,
      countryCode: 'mx',
    });
    expect(streams[1]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
    expect(streams[2]).toStrictEqual({
      url: expect.any(URL),
      label: 'Mixdrop',
      sourceId: 'mixdrop_mx',
      height: 0,
      bytes: 1299227607,
      countryCode: 'mx',
      requestHeaders: {
        'Referer': 'https://mixdrop.ag',
        'User-Agent': 'Fake UserAgent',
      },
    });
    expect(streams[2]?.url.href).toMatch(/^https:\/\/.*?s=.*?e=.*?t=/);
    expect(streams[3]).toStrictEqual({
      url: expect.any(URL),
      label: 'DoodStream',
      sourceId: 'doodstream_mx',
      height: 0,
      bytes: 0,
      countryCode: 'mx',
      requestHeaders: {
        Referer: 'http://dood.to/',
      },
    });
    expect(streams[3]?.url.href).toMatch(/^https:\/\/.*?token.*?expiry/);
    expect(streams[4]).toStrictEqual({
      url: expect.any(URL),
      label: 'SuperVideo',
      sourceId: 'supervideo_es',
      height: 720,
      bytes: 1288490188,
      countryCode: 'es',
    });
    expect(streams[4]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
    expect(streams[5]).toStrictEqual({
      url: expect.any(URL),
      label: 'Dropload',
      sourceId: 'dropload_es',
      height: 720,
      bytes: 1181116006,
      countryCode: 'es',
    });
    expect(streams[5]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
    expect(streams[6]).toStrictEqual({
      url: expect.any(URL),
      label: 'Mixdrop',
      sourceId: 'mixdrop_es',
      height: 0,
      bytes: 1342177280,
      countryCode: 'es',
      requestHeaders: {
        'Referer': 'https://mixdrop.ag',
        'User-Agent': 'Fake UserAgent',
      },
    });
    expect(streams[6]?.url.href).toMatch(/^https:\/\/.*?s=.*?e=.*?t=/);
    expect(streams[7]).toStrictEqual({
      url: expect.any(URL),
      label: 'DoodStream',
      sourceId: 'doodstream_es',
      height: 0,
      bytes: 0,
      countryCode: 'es',
      requestHeaders: {
        Referer: 'http://dood.to/',
      },
    });
    expect(streams[7]?.url.href).toMatch(/^https:\/\/.*?token.*?expiry/);
  });
});
