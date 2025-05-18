import winston from 'winston';
import { Frembed } from './Frembed';
import { ExtractorRegistry } from '../extractor';
import { Fetcher } from '../utils';
import { Context } from '../types';
jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const handler = new Frembed(fetcher, new ExtractorRegistry(logger, fetcher));
const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { fr: 'on' } };

describe('Frembed', () => {
  test('does not handle non imdb series', async () => {
    const streams = await handler.handle(ctx, 'series', 'kitsu:123');

    expect(streams).toHaveLength(0);
  });

  test('handles non-existent series gracefully', async () => {
    const streams = await handler.handle(ctx, 'series', 'tt4352342:1:1');

    expect(streams).toHaveLength(0);
  });

  test('handle imdb black mirror s4e2', async () => {
    const streams = (await handler.handle(ctx, 'series', 'tt2085059:4:2')).filter(stream => stream !== undefined);

    expect(streams).toHaveLength(1);
    expect(streams[0]).toStrictEqual({
      url: expect.any(URL),
      label: 'DoodStream',
      sourceId: 'doodstream_fr',
      height: 0,
      bytes: 0,
      countryCode: 'fr',
      requestHeaders: {
        Referer: 'http://dood.to/',
      },
    });
    expect(streams[0]?.url.href).toMatch(/^https:\/\/.*?token.*?expiry/);
  });

  test('handle imdb black mirror s7e1', async () => {
    const streams = (await handler.handle(ctx, 'series', 'tt2085059:7:1')).filter(stream => stream !== undefined);

    expect(streams).toHaveLength(1);
    expect(streams[0]).toStrictEqual({
      url: expect.any(URL),
      label: 'UQLoad',
      sourceId: 'uqload_fr',
      height: 0,
      bytes: 0,
      countryCode: 'fr',
      requestHeaders: {
        Referer: 'https://uqload.net',
      },
    });
    expect(streams[0]?.url.href).toMatch(/^https:\/\/.*?uqload\.net\/.*?\.mp4/);
  });
});
