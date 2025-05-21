import winston from 'winston';
import { ExtractorRegistry } from '../extractor';
import { StreamResolver } from './StreamResolver';
import { MeineCloud, MostraGuarda } from '../handler';
import { Fetcher } from './Fetcher';
import { Context } from '../types';
jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const streamResolver = new StreamResolver(logger);
const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { de: 'on', it: 'on' } };

// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const extractorRegistry = new ExtractorRegistry(logger, fetcher);
const meineCloud = new MeineCloud(fetcher, extractorRegistry);
const mostraGuarda = new MostraGuarda(fetcher, extractorRegistry);

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
      title: '❌ Error with handler "meinecloud". Please create an issue if this persists. Request-id: id',
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
        behaviorHints: {
          bingeGroup: 'webstreamr-dropload_de',
          videoSize: 1395864371,
        },
      },
      {
        url: expect.any(String),
        name: 'WebStreamr 720p',
        title: 'Dropload | 💾 1.1 GB | 🇮🇹',
        behaviorHints: {
          bingeGroup: 'webstreamr-dropload_it',
          videoSize: 1181116006,
        },
      },
      {
        url: expect.any(String),
        name: 'WebStreamr 720p',
        title: 'SuperVideo | 💾 1.1 GB | 🇮🇹',
        behaviorHints: {
          bingeGroup: 'webstreamr-supervideo_it',
          videoSize: 1181116006,
        },
      },
      {
        url: expect.any(String),
        name: 'WebStreamr 720p',
        title: 'SuperVideo | 💾 1 GB | 🇩🇪',
        behaviorHints: {
          bingeGroup: 'webstreamr-supervideo_de',
          videoSize: 1073741824,
        },
      },
      {
        url: expect.any(String),
        name: 'WebStreamr',
        title: 'DoodStream | 🇩🇪',
        behaviorHints: {
          bingeGroup: 'webstreamr-doodstream_de',
          notWebReady: true,
          proxyHeaders: {
            request: {
              Referer: 'http://dood.to/',
            },
          },
        },
      },
      {
        url: expect.any(String),
        name: 'WebStreamr',
        title: 'DoodStream | 🇮🇹',
        behaviorHints: {
          bingeGroup: 'webstreamr-doodstream_it',
          notWebReady: true,
          proxyHeaders: {
            request: {
              Referer: 'http://dood.to/',
            },
          },
        },
      },
      {
        externalUrl: 'https://mixdrop.ag/e/3nzwveprim63or6',
        name: 'WebStreamr external',
        title: 'mixdrop.ag | 🇩🇪',
        behaviorHints: {
          bingeGroup: 'webstreamr-external_de',
        },
      },
      {
        externalUrl: 'https://mixdrop.ag/e/vk196d6xfzwwo1',
        name: 'WebStreamr external',
        title: 'mixdrop.ag | 🇮🇹',
        behaviorHints: {
          bingeGroup: 'webstreamr-external_it',
        },
      },
    ]);
  });
});
