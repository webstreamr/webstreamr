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
const ctx: Context = { id: 'id', ip: '127.0.0.1' };

describe('VerHdLink', () => {
  test('does not handle non imdb movies', async () => {
    const streams = await handler.handle(ctx, 'movie', 'kitsu:123');

    expect(streams).toHaveLength(0);
  });

  test('handles non-existent movies gracefully', async () => {
    const streams = await handler.handle(ctx, 'movie', 'tt12345678');

    expect(streams).toHaveLength(0);
  });

  test('handle titanic', async () => {
    const streams = (await handler.handle(ctx, 'movie', 'tt0120338')).filter(stream => stream !== undefined);

    expect(streams).toHaveLength(4);
    expect(streams[0]).toStrictEqual({
      url: expect.any(URL),
      label: 'SuperVideo',
      sourceId: 'supervideo_mx',
      height: 556,
      bytes: 1503238553,
      countryCode: 'mx',
    });
    expect(streams[0]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
    expect(streams[1]).toStrictEqual({
      url: expect.any(URL),
      label: 'Dropload',
      sourceId: 'dropload_mx',
      height: 556,
      bytes: 1503238553,
      countryCode: 'mx',
    });
    expect(streams[1]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
    expect(streams[2]).toStrictEqual({
      url: expect.any(URL),
      label: 'SuperVideo',
      sourceId: 'supervideo_es',
      height: 544,
      bytes: 1610612736,
      countryCode: 'es',
    });
    expect(streams[2]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
    expect(streams[3]).toStrictEqual({
      url: expect.any(URL),
      label: 'Dropload',
      sourceId: 'dropload_es',
      height: 544,
      bytes: 1610612736,
      countryCode: 'es',
    });
    expect(streams[3]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
  });
});
