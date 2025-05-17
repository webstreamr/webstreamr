import winston from 'winston';
import { Eurostreaming } from './Eurostreaming';
import { ExtractorRegistry } from '../extractor';
import { Fetcher } from '../utils';
import { Context } from '../types';
jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const handler = new Eurostreaming(fetcher, new ExtractorRegistry(logger, fetcher));
const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { it: 'on' } };

describe('Eurostreaming', () => {
  test('does not handle non imdb series', async () => {
    const streams = await handler.handle(ctx, 'series', 'kitsu:123');

    expect(streams).toHaveLength(0);
  });

  test('handles non-existent series gracefully', async () => {
    const streams = await handler.handle(ctx, 'series', 'tt12345678:1:1');

    expect(streams).toHaveLength(0);
  });

  test('handle imdb black mirror s2e4', async () => {
    const streams = (await handler.handle(ctx, 'series', 'tt2085059:2:4')).filter(stream => stream !== undefined);

    expect(streams).toHaveLength(2);
    expect(streams[0]).toStrictEqual({
      url: expect.any(URL),
      label: 'SuperVideo',
      sourceId: 'supervideo_it',
      height: 1080,
      bytes: 875875532,
      countryCode: 'it',
    });
    expect(streams[0]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
    expect(streams[1]).toStrictEqual({
      url: expect.any(URL),
      label: 'Dropload',
      sourceId: 'dropload_it',
      height: 1080,
      bytes: 875875532,
      countryCode: 'it',
    });
    expect(streams[1]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
  });
});
