import { KinoKiste } from './KinoKiste';
import { Dropload, EmbedExtractors, SuperVideo } from '../embed-extractor';
import { Fetcher } from '../utils';
import { Context } from '../types';
jest.mock('../utils/Fetcher');

// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const kinokiste = new KinoKiste(fetcher, new EmbedExtractors([new Dropload(fetcher), new SuperVideo(fetcher)]));
const ctx: Context = { ip: '127.0.0.1' };

describe('KinoKiste', () => {
  test('does not handle non imdb series', async () => {
    const streams = await kinokiste.handle(ctx, 'kitsu:123');

    expect(streams).toHaveLength(0);
  });

  test('handles non-existent series gracefully', async () => {
    const streams = await kinokiste.handle(ctx, 'tt12345678:1:1');

    expect(streams).toHaveLength(0);
  });

  test('handle imdb black mirror s2e4', async () => {
    const streams = await kinokiste.handle(ctx, 'tt2085059:2:4');

    expect(streams).toHaveLength(2);
    expect(streams[0]).toStrictEqual({
      url: expect.any(URL),
      label: 'SuperVideo',
      sourceId: 'supervideo_de',
      height: 720,
      bytes: 733793484,
      countryCode: 'de',
    });
    expect(streams[0]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
    expect(streams[1]).toStrictEqual({
      url: expect.any(URL),
      label: 'Dropload',
      sourceId: 'dropload_de',
      height: 720,
      bytes: 733793484,
      countryCode: 'de',
    });
    expect(streams[1]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
  });
});
