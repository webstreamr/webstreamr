import { ContentType } from 'stremio-addon-sdk';
import winston from 'winston';
import { ExtractorRegistry } from '../extractor';
import { StreamResolver } from './StreamResolver';
import { Handler, MeineCloud, MostraGuarda } from '../handler';
import { Fetcher } from './Fetcher';
import { Context, CountryCode, TIMEOUT, UrlResult } from '../types';
import { BlockedError, HttpError, NotFoundError, QueueIsFullError } from '../error';
import { ImdbId } from './id';
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
    const streams = await streamResolver.resolve(ctx, [], 'movie', new ImdbId('tt123456789', undefined, undefined));

    expect(streams).toMatchSnapshot();
  });

  test('returns handler errors as stream', async () => {
    const fetcherSpy = jest.spyOn(fetcher, 'text').mockRejectedValue('ups, an error occurred.');

    const streams = await streamResolver.resolve(ctx, [meineCloud], 'movie', new ImdbId('tt123456789', undefined, undefined));

    expect(streams).toMatchSnapshot();

    fetcherSpy.mockRestore();
  });

  test('returns empty array if no handler found anything', async () => {
    const streams = await streamResolver.resolve(ctx, [meineCloud, mostraGuarda], 'movie', new ImdbId('tt12345678', undefined, undefined));

    expect(streams).toMatchSnapshot();
  });

  test('returns empty array if no handler supported the type', async () => {
    const streams = await streamResolver.resolve(ctx, [meineCloud, mostraGuarda], 'series', new ImdbId('tt12345678', 1, 1));

    expect(streams).toMatchSnapshot();
  });

  test('returns sorted results', async () => {
    const streams = await streamResolver.resolve(ctx, [meineCloud, mostraGuarda], 'movie', new ImdbId('tt29141112', undefined, undefined));
    expect(streams).toMatchSnapshot();
  });

  test('adds error info', async () => {
    class MockHandler implements Handler {
      readonly id = 'mockhandler';

      readonly label = 'MockHandler';

      readonly contentTypes: ContentType[] = ['movie'];

      readonly countryCodes: CountryCode[] = ['de'];

      readonly handle = async (): Promise<(UrlResult[])[]> => {
        return [
          [
            {
              url: new URL('https://example.com'),
              isExternal: true,
              error: new BlockedError('cloudflare_challenge', {}),
              label: 'hoster.com',
              sourceId: '',
              meta: {
                countryCode: 'de',
              },
            },
            {
              url: new URL('https://example.com'),
              isExternal: true,
              error: new BlockedError('unknown', {}),
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
            {
              url: new URL('https://example4.com'),
              isExternal: true,
              error: new HttpError(500, 'Internal Server Error', { 'x-foo': 'bar' }),
              label: 'hoster.com',
              sourceId: '',
              meta: {
                countryCode: 'de',
              },
            },
          ],
        ];
      };
    }

    const streams = await streamResolver.resolve(ctx, [new MockHandler()], 'movie', new ImdbId('tt11655566', undefined, undefined));
    expect(streams).toMatchSnapshot();

    const streamsWithoutExternalUrls = await streamResolver.resolve({ ...ctx, config: { ...ctx.config, excludeExternalUrls: 'on' } }, [new MockHandler()], 'movie', new ImdbId('tt11655566', undefined, undefined));
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

    const streams = await streamResolver.resolve(ctx, [mockHandler], 'movie', new ImdbId('tt12345678', undefined, undefined));

    expect(streams).toMatchSnapshot();
  });
});
