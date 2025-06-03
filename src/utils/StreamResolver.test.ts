import winston from 'winston';
import { ExtractorRegistry } from '../extractor';
import { StreamResolver } from './StreamResolver';
import { Handler, MeineCloud, MostraGuarda } from '../handler';
import { Fetcher } from './Fetcher';
import { Context, CountryCode, TIMEOUT, UrlResult } from '../types';
import { BlockedError, NotFoundError, QueueIsFullError } from '../error';
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
    const fetcherSpy = jest.spyOn(fetcher, 'text').mockRejectedValue('ups, an error occurred.');

    const streams = await streamResolver.resolve(ctx, [meineCloud], 'movie', 'tt123456789');

    expect(streams).toStrictEqual([{
      name: 'WebStreamr',
      title: '🔗 MeineCloud\n❌ Request failed. Request-id: id.',
      ytId: 'E4WlUXrJgy4',
    }]);

    fetcherSpy.mockRestore();
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
    expect(streams).toMatchSnapshot();
  });

  test('adds error info', async () => {
    class MockHandler implements Handler {
      readonly id = 'mockhandler';

      readonly label = 'MockHandler';

      readonly contentTypes = ['movie'];

      readonly countryCodes: CountryCode[] = ['de'];

      readonly handle = async (): Promise<(UrlResult | undefined)[]> => {
        return [
          {
            url: new URL('https://example.com'),
            isExternal: true,
            error: new BlockedError('cloudflare_challenge'),
            label: 'hoster.com',
            sourceId: '',
            meta: {
              countryCode: 'de',
            },
          },
          {
            url: new URL('https://example2.com'),
            isExternal: true,
            error: new TypeError(),
            label: 'hoster.com',
            sourceId: '',
            meta: {
              countryCode: 'de',
            },
          },
          {
            url: new URL('https://example2.com'),
            isExternal: true,
            error: TIMEOUT,
            label: 'hoster.com',
            sourceId: '',
            meta: {
              countryCode: 'de',
            },
          },
          {
            url: new URL('https://example3.com'),
            isExternal: true,
            error: new QueueIsFullError(),
            label: 'hoster.com',
            sourceId: '',
            meta: {
              countryCode: 'de',
            },
          },
        ];
      };
    }

    const streams = await streamResolver.resolve(ctx, [new MockHandler()], 'movie', 'tt11655566');
    expect(streams).toMatchSnapshot();

    const streamsWithoutExternalUrls = await streamResolver.resolve({ ...ctx, config: { ...ctx.config, excludeExternalUrls: 'on' } }, [new MockHandler()], 'movie', 'tt11655566');
    expect(streamsWithoutExternalUrls).toMatchSnapshot();
  });

  test('ignores not found errors', async () => {
    const mockHandler: Handler = {
      id: 'mockhandler',
      label: 'MockHandler',
      contentTypes: ['movie'],
      countryCodes: ['de'],
      handle: jest.fn().mockRejectedValue(new NotFoundError()),
    };

    const streams = await streamResolver.resolve(ctx, [mockHandler], 'movie', 'tt12345678');
    expect(streams).toStrictEqual([]);
  });
});
