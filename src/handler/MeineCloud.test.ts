import fs from 'node:fs';
import slugify from 'slugify';
import { MeineCloud } from './MeineCloud';
import { cachedFetchText } from '../utils';

const meinecloud = new MeineCloud();

jest.mock('./../utils/fetch', () => ({
  cachedFetchText: jest.fn(),
}));
(cachedFetchText as jest.Mock).mockImplementation(
  (url: string) => fs.readFileSync(`${__dirname}/fixtures/meinecloud/${slugify(url)}`).toString(),
);

describe('MeineCloud', () => {
  test('does not handle non imdb movies', async () => {
    const streams = await meinecloud.handle('kitsu:123');

    expect(streams).toHaveLength(0);
  });

  test('handles non-existent movies gracefully', async () => {
    const streams = await meinecloud.handle('tt12345678');

    expect(streams).toHaveLength(0);
  });

  test('handle imdb the devil\'s bath', async () => {
    const streams = await meinecloud.handle('tt29141112');

    expect(streams).toHaveLength(2);
    expect(streams[0]).toStrictEqual({
      behaviorHints: {
        group: 'webstreamr-meinecloud-supervideo',
      },
      name: 'WebStreamr DE | 720p',
      resolution: '720p',
      size: '1.0 GB',
      title: 'MeineCloud - supervideo | 💾 1.0 GB | 🇩🇪',
      url: expect.stringMatching(/^https:\/\/.*?.m3u8/),
    });
    expect(streams[1]).toStrictEqual({
      behaviorHints: {
        group: 'webstreamr-meinecloud-dropload',
      },
      name: 'WebStreamr DE | 1080p',
      resolution: '1080p',
      size: '1.3 GB',
      title: 'MeineCloud - dropload | 💾 1.3 GB | 🇩🇪',
      url: expect.stringMatching(/^https:\/\/.*?.m3u8/),
    });
  });
});
