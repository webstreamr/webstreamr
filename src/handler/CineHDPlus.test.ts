import winston from 'winston';
import { CineHDPlus } from './CineHDPlus';
import { ExtractorRegistry } from '../extractor';
import { Fetcher } from '../utils';
import { Context } from '../types';
jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const handler = new CineHDPlus(fetcher, new ExtractorRegistry(logger, fetcher));
const ctx: Context = { ip: '127.0.0.1' };

describe('CineHDPlus', () => {
  test('does not handle non imdb series', async () => {
    const streams = await handler.handle(ctx, 'series', 'kitsu:123');

    expect(streams).toHaveLength(0);
  });

  test('handles non-existent series gracefully', async () => {
    const streams = await handler.handle(ctx, 'series', 'tt12345678:1:1');

    expect(streams).toHaveLength(0);
  });

  test('handle imdb black mirror s2e3 (mx)', async () => {
    const streams = (await handler.handle(ctx, 'series', 'tt2085059:2:3')).filter(stream => stream !== undefined);

    expect(streams).toHaveLength(2);
    expect(streams[0]).toStrictEqual({
      url: expect.any(URL),
      label: 'SuperVideo',
      sourceId: 'supervideo_mx',
      height: 360,
      bytes: 146800640,
      countryCode: 'mx',
    });
    expect(streams[0]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
    expect(streams[1]).toStrictEqual({
      url: expect.any(URL),
      label: 'Dropload',
      sourceId: 'dropload_mx',
      height: 360,
      bytes: 146800640,
      countryCode: 'mx',
    });
    expect(streams[1]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
  });

  test('handle imdb babylon 5 s2e3 (es)', async () => {
    const streams = (await handler.handle(ctx, 'series', 'tt0105946:2:3')).filter(stream => stream !== undefined);

    expect(streams).toHaveLength(2);
    expect(streams[0]).toStrictEqual({
      url: expect.any(URL),
      label: 'SuperVideo',
      sourceId: 'supervideo_es',
      height: 344,
      bytes: 219571814,
      countryCode: 'es',
    });
    expect(streams[0]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
    expect(streams[1]).toStrictEqual({
      url: expect.any(URL),
      label: 'Dropload',
      sourceId: 'dropload_es',
      height: 344,
      bytes: 219571814,
      countryCode: 'es',
    });
    expect(streams[1]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
  });
});
