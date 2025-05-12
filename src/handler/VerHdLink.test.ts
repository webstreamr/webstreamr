import { VerHdLink } from './VerHdLink';
import { Fetcher } from '../utils';
import { Dropload, EmbedExtractors, SuperVideo } from '../embed-extractor';
import { Context } from '../types';
jest.mock('../utils/Fetcher');

// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const mostraguarda = new VerHdLink(fetcher, new EmbedExtractors([new Dropload(fetcher), new SuperVideo(fetcher)]));
const ctx: Context = { ip: '127.0.0.1' };

describe('VerHdLink', () => {
  test('does not handle non imdb movies', async () => {
    const streams = await mostraguarda.handle(ctx, 'kitsu:123');

    expect(streams).toHaveLength(0);
  });

  test('handles non-existent movies gracefully', async () => {
    const streams = await mostraguarda.handle(ctx, 'tt12345678');

    expect(streams).toHaveLength(0);
  });

  test('handle titanic', async () => {
    const streams = await mostraguarda.handle(ctx, 'tt0120338');

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
