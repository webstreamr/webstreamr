import { MeineCloud } from './MeineCloud';
import { Fetcher } from '../utils';
import { Dropload, EmbedExtractors, SuperVideo } from '../embed-extractor';
import { Context } from '../types';
jest.mock('../utils/Fetcher');

// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const meinecloud = new MeineCloud(fetcher, new EmbedExtractors([new Dropload(fetcher), new SuperVideo(fetcher)]));
const ctx: Context = { ip: '127.0.0.1' };

describe('MeineCloud', () => {
  test('does not handle non imdb movies', async () => {
    const streams = await meinecloud.handle(ctx, 'kitsu:123');

    expect(streams).toHaveLength(0);
  });

  test('handles non-existent movies gracefully', async () => {
    const streams = await meinecloud.handle(ctx, 'tt12345678');

    expect(streams).toHaveLength(0);
  });

  test('handle imdb the devil\'s bath', async () => {
    const streams = await meinecloud.handle(ctx, 'tt29141112');

    expect(streams).toHaveLength(2);
    expect(streams[0]).toStrictEqual({
      url: expect.any(URL),
      label: 'SuperVideo',
      sourceId: 'supervideo',
      height: '720',
      size: '1.0 GB',
      language: 'de',
    });
    expect(streams[0]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
    expect(streams[1]).toStrictEqual({
      url: expect.any(URL),
      label: 'Dropload',
      sourceId: 'dropload',
      height: '1080',
      size: '1.3 GB',
      language: 'de',
    });
    expect(streams[1]?.url.href).toMatch(/^https:\/\/.*?.m3u8/);
  });
});
