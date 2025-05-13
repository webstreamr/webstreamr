import winston from 'winston';
import { EmbedExtractorRegistry } from '../embed-extractor';
import { StreamResolver } from './StreamResolver';
import { MeineCloud, MostraGuarda } from '../handler';
import { Fetcher } from './Fetcher';
import { Context } from '../types';
jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const streamResolver = new StreamResolver(logger);
const ctx: Context = { ip: '127.0.0.1' };

// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const embedExtractorRegistry = new EmbedExtractorRegistry(logger, fetcher);
const meineCloud = new MeineCloud(fetcher, embedExtractorRegistry);
const mostraGuarda = new MostraGuarda(fetcher, embedExtractorRegistry);

describe('resolve', () => {
  test('returns info as stream if no handlers were configured', async () => {
    const streams = await streamResolver.resolve(ctx, [], 'movie', 'tt123456789');

    expect(streams).toStrictEqual([{
      name: 'WebStreamr',
      title: '⚠️ No handlers found. Please re-configure the plugin.',
      ytId: 'E4WlUXrJgy4',
    }]);
  });

  test('returns handler errors as stream', async () => {
    jest.spyOn(fetcher, 'text').mockRejectedValue('ups, an error occurred.');

    const streams = await streamResolver.resolve(ctx, [meineCloud], 'movie', 'tt123456789');

    expect(streams).toStrictEqual([{
      name: 'WebStreamr',
      title: '❌ Error with handler "meinecloud". Please check the logs or create an issue if this persists.',
      ytId: 'E4WlUXrJgy4',
    }]);
  });

  test('returns empty array if no handler found anything', async () => {
    const streams = await streamResolver.resolve(ctx, [meineCloud, mostraGuarda], 'movie', 'tt12345678');

    expect(streams).toStrictEqual([]);
  });

  test('returns empty array if no handler supported the type', async () => {
    const streams = await streamResolver.resolve(ctx, [meineCloud, mostraGuarda], 'series', 'tt12345678:1:1');

    expect(streams).toStrictEqual([]);
  });

  test('returns sorted results', async () => {
    const streams = await streamResolver.resolve(ctx, [meineCloud, mostraGuarda], 'movie', 'tt29141112');

    expect(streams).toStrictEqual([
      {
        url: expect.any(String),
        name: 'WebStreamr 1080p',
        title: 'Dropload | 💾 1.3 GB | 🇩🇪',
        behaviourHints: {
          group: 'webstreamr-dropload_de',
        },
      },
      {
        url: expect.any(String),
        name: 'WebStreamr 720p',
        title: 'SuperVideo | 💾 1.1 GB | 🇮🇹',
        behaviourHints: {
          group: 'webstreamr-supervideo_it',
        },
      },
      {
        url: expect.any(String),
        name: 'WebStreamr 720p',
        title: 'Dropload | 💾 1.1 GB | 🇮🇹',
        behaviourHints: {
          group: 'webstreamr-dropload_it',
        },
      },
      {
        url: expect.any(String),
        name: 'WebStreamr 720p',
        title: 'SuperVideo | 💾 1 GB | 🇩🇪',
        behaviourHints: {
          group: 'webstreamr-supervideo_de',
        },
      },
    ]);
  });
});
