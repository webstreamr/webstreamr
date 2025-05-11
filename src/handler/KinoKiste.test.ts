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
      behaviorHints: {
        group: 'webstreamr-supervideo',
      },
      name: 'WebStreamr 720p',
      resolution: '720p',
      size: '699.8 MB',
      title: 'SuperVideo | 💾 699.8 MB | 🇩🇪',
      url: expect.stringMatching(/^https:\/\/.*?.m3u8/),
    });
    expect(streams[1]).toStrictEqual({
      behaviorHints: {
        group: 'webstreamr-dropload',
      },
      name: 'WebStreamr 720p',
      resolution: '720p',
      size: '699.8 MB',
      title: 'Dropload | 💾 699.8 MB | 🇩🇪',
      url: expect.stringMatching(/^https:\/\/.*?.m3u8/),
    });
  });
});
