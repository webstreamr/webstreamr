import { KinoKiste } from './KinoKiste';

const kinokiste = new KinoKiste();

describe('KinoKiste', () => {
  test('does not handle non imdb series', async () => {
    const streams = await kinokiste.handle('kitsu:123');

    expect(streams).toHaveLength(0);
  });

  test('handles non-existent series gracefully', async () => {
    const streams = await kinokiste.handle('tt12345678:1:1');

    expect(streams).toHaveLength(0);
  });

  test('handle imdb black mirror s2e4', async () => {
    const streams = await kinokiste.handle('tt2085059:2:4');

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
