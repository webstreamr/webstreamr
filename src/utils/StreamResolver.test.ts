import { ContentType } from 'stremio-addon-sdk';
import winston from 'winston';
import { createExtractors, Extractor, ExtractorRegistry } from '../extractor';
import { StreamResolver } from './StreamResolver';
import { MeineCloud, MostraGuarda, Source, SourceResult } from '../source';
import { BlockedReason, CountryCode, Format, UrlResult } from '../types';
import { BlockedError, HttpError, NotFoundError, QueueIsFullError, TimeoutError, TooManyRequestsError, TooManyTimeoutsError } from '../error';
import { ImdbId } from './id';
import { FetcherMock } from './FetcherMock';
import { createTestContext } from '../test';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const fetcher = new FetcherMock(`${__dirname}/__fixtures__/StreamResolver`);
const ctx = createTestContext({ de: 'on', it: 'on' });

const meineCloud = new MeineCloud(fetcher);
const mostraGuarda = new MostraGuarda(fetcher);

describe('resolve', () => {
  test('returns info as stream if no sources were configured', async () => {
    const streamResolver = new StreamResolver(logger, new ExtractorRegistry(logger, createExtractors(fetcher)));

    const streams = await streamResolver.resolve(ctx, [], 'movie', new ImdbId('tt123456789', undefined, undefined));

    expect(streams).toMatchSnapshot();
  });

  test('returns source errors as stream', async () => {
    const fetcherSpy = jest.spyOn(fetcher, 'text').mockRejectedValue('ups, an error occurred.');
    const streamResolver = new StreamResolver(logger, new ExtractorRegistry(logger, createExtractors(fetcher)));

    const streams = await streamResolver.resolve(ctx, [meineCloud], 'movie', new ImdbId('tt123456789', undefined, undefined));

    expect(streams).toMatchSnapshot();

    fetcherSpy.mockRestore();
  });

  test('returns empty array if no source found anything', async () => {
    const streamResolver = new StreamResolver(logger, new ExtractorRegistry(logger, createExtractors(fetcher)));

    const streams = await streamResolver.resolve(ctx, [meineCloud, mostraGuarda], 'movie', new ImdbId('tt12345678', undefined, undefined));

    expect(streams).toMatchSnapshot();
  });

  test('returns empty array if no source supported the type', async () => {
    const streamResolver = new StreamResolver(logger, new ExtractorRegistry(logger, createExtractors(fetcher)));

    const streams = await streamResolver.resolve(ctx, [meineCloud, mostraGuarda], 'series', new ImdbId('tt12345678', 1, 1));

    expect(streams).toMatchSnapshot();
  });

  test('returns sorted results', async () => {
    const streamResolver = new StreamResolver(logger, new ExtractorRegistry(logger, createExtractors(fetcher)));

    const streams = await streamResolver.resolve(ctx, [meineCloud, mostraGuarda], 'movie', new ImdbId('tt29141112', undefined, undefined));
    expect(streams.ttl).not.toBeUndefined();
    expect(streams.streams).toMatchSnapshot();

    const streamsWithExternalUrls = await streamResolver.resolve({ ...ctx, config: { ...ctx.config, includeExternalUrls: 'on' } }, [meineCloud, mostraGuarda], 'movie', new ImdbId('tt29141112', undefined, undefined));
    expect(streamsWithExternalUrls.ttl).not.toBeUndefined();
    expect(streamsWithExternalUrls.streams).toMatchSnapshot();
  });

  test('adds error info', async () => {
    class MockHandler implements Source {
      public readonly id = 'mockhandler';

      public readonly label = 'MockHandler';

      public readonly contentTypes: ContentType[] = ['movie'];

      public readonly countryCodes: CountryCode[] = [CountryCode.de];

      public readonly handle = async (): Promise<SourceResult[]> => {
        return [{ countryCode: CountryCode.de, url: new URL('https://example.com') }];
      };
    }

    class MockExtractor extends Extractor {
      public readonly id = 'mockextractor';

      public readonly label = 'MockExtractor';

      public override readonly ttl = 1;

      public readonly supports = (): boolean => true;

      protected readonly extractInternal = async (): Promise<UrlResult[]> =>
        [
          {
            url: new URL('https://example.com'),
            format: Format.unknown,
            isExternal: true,
            error: new BlockedError(BlockedReason.cloudflare_challenge, {}),
            label: 'hoster.com',
            sourceId: '',
            meta: {
              countryCode: CountryCode.de,
            },
          },
          {
            url: new URL('https://example.com'),
            format: Format.unknown,
            isExternal: true,
            error: new BlockedError(BlockedReason.media_flow_proxy_auth, {}),
            label: 'hoster.com',
            sourceId: '',
            meta: {
              countryCode: CountryCode.de,
            },
          },
          {
            url: new URL('https://example.com'),
            format: Format.unknown,
            isExternal: true,
            error: new BlockedError(BlockedReason.unknown, {}),
            label: 'hoster.com',
            sourceId: '',
            meta: {
              countryCode: CountryCode.de,
            },
          },
          {
            url: new URL('https://example.com'),
            format: Format.unknown,
            isExternal: true,
            error: new TooManyRequestsError(10),
            label: 'hoster.com',
            sourceId: '',
            meta: {
              countryCode: CountryCode.de,
            },
          },
          {
            url: new URL('https://example.com'),
            format: Format.unknown,
            isExternal: true,
            error: new TooManyTimeoutsError(),
            label: 'hoster.com',
            sourceId: '',
            meta: {
              countryCode: CountryCode.de,
            },
          },
          {
            url: new URL('https://example2.com'),
            format: Format.unknown,
            isExternal: true,
            error: new TypeError(),
            label: 'hoster.com',
            sourceId: '',
            meta: {
              countryCode: CountryCode.de,
            },
          },
          {
            url: new URL('https://example2.com'),
            format: Format.unknown,
            isExternal: true,
            error: new TimeoutError(),
            label: 'hoster.com',
            sourceId: '',
            meta: {
              countryCode: CountryCode.de,
            },
          },
          {
            url: new URL('https://example3.com'),
            format: Format.unknown,
            isExternal: true,
            error: new QueueIsFullError(),
            label: 'hoster.com',
            sourceId: '',
            meta: {
              countryCode: CountryCode.de,
            },
          },
          {
            url: new URL('https://example4.com'),
            format: Format.unknown,
            isExternal: true,
            error: new HttpError(500, 'Internal Server Error', { 'x-foo': 'bar' }),
            label: 'hoster.com',
            sourceId: '',
            meta: {
              countryCode: CountryCode.de,
            },
          },
        ];
    }

    const streamResolver = new StreamResolver(logger, new ExtractorRegistry(logger, [new MockExtractor()]));

    const streams = await streamResolver.resolve(ctx, [new MockHandler()], 'movie', new ImdbId('tt11655566', undefined, undefined));
    expect(streams).toMatchSnapshot();

    const streamsWithExternalUrls = await streamResolver.resolve({ ...ctx, config: { ...ctx.config, includeExternalUrls: 'on' } }, [new MockHandler()], 'movie', new ImdbId('tt11655566', undefined, undefined));
    expect(streamsWithExternalUrls).toMatchSnapshot();
  });

  test('ignores not found errors', async () => {
    const mockHandler: Source = {
      id: 'mockhandler',
      label: 'MockHandler',
      contentTypes: ['movie'],
      countryCodes: [CountryCode.de],
      handle: jest.fn().mockRejectedValue(new NotFoundError()),
    };
    const streamResolver = new StreamResolver(logger, new ExtractorRegistry(logger, createExtractors(fetcher)));

    const streams = await streamResolver.resolve(ctx, [mockHandler], 'movie', new ImdbId('tt12345678', undefined, undefined));

    expect(streams).toMatchSnapshot();
  });
});
