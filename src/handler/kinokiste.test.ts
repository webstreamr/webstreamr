import fs from 'node:fs';
import slugify from 'slugify';
import { cachedFetchText } from '../utils';
import { handleKinoKiste } from './kinokiste';

jest.mock('./../utils/fetch', () => ({
  cachedFetchText: jest.fn(),
}));
(cachedFetchText as jest.Mock).mockImplementation(
  (url: string) => fs.readFileSync(`${__dirname}/fixtures/kinokiste/${slugify(url)}`).toString(),
);

describe('KinoKiste', () => {
  test('does not handle movies', async () => {
    const streams = await handleKinoKiste({ type: 'movie', id: 'tt29141112' });

    expect(streams).toHaveLength(0);
  });

  test('does not handle non imdb series', async () => {
    const streams = await handleKinoKiste({ type: 'series', id: 'kitsu:123' });

    expect(streams).toHaveLength(0);
  });

  test('handles non-existent series gracefully', async () => {
    const streams = await handleKinoKiste({ type: 'series', id: 'tt12345678:1:1' });

    expect(streams).toHaveLength(0);
  });

  test('handle imdb black mirror s2e4', async () => {
    const streams = await handleKinoKiste({ type: 'series', id: 'tt2085059:2:4' });

    expect(streams).toHaveLength(2);
    expect(streams[0]).toStrictEqual({
      behaviorHints: {
        group: 'webstreamr-kinokiste-supervideo',
      },
      name: 'WebStreamr DE | 720p',
      resolution: '720p',
      size: '699.8 MB',
      title: 'KinoKiste - supervideo | 💾 699.8 MB | 🇩🇪',
      url: expect.stringMatching(/^https:\/\/.*?.m3u8/),
    });
    expect(streams[1]).toStrictEqual({
      behaviorHints: {
        group: 'webstreamr-kinokiste-dropload',
      },
      name: 'WebStreamr DE | 720p',
      resolution: '720p',
      size: '699.8 MB',
      title: 'KinoKiste - dropload | 💾 699.8 MB | 🇩🇪',
      url: expect.stringMatching(/^https:\/\/.*?.m3u8/),
    });
  });
});
