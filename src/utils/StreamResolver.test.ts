import { ContentType } from 'stremio-addon-sdk';
import winston from 'winston';
import { BlockedError, HttpError, NotFoundError, QueueIsFullError, TimeoutError, TooManyRequestsError, TooManyTimeoutsError } from '../error';
import { createExtractors, Extractor, ExtractorRegistry } from '../extractor';
import { HubCloud } from '../extractor/HubCloud';
import { RgShows as RgShowsExtractor } from '../extractor/RgShows';
import { VidSrc as VidSrcExtractor } from '../extractor/VidSrc';
import { VixSrc as VixSrcExtractor } from '../extractor/VixSrc';
import { Source, SourceResult } from '../source';
import { FourKHDHub } from '../source/FourKHDHub';
import { MeineCloud } from '../source/MeineCloud';
import { MostraGuarda } from '../source/MostraGuarda';
import { RgShows } from '../source/RgShows';
import { VidSrc } from '../source/VidSrc';
import { VixSrc } from '../source/VixSrc';
import { createTestContext } from '../test';
import { BlockedReason, CountryCode, Format, UrlResult } from '../types';
import { FetcherMock } from './FetcherMock';
import { ImdbId, TmdbId } from './id';
import { StreamResolver } from './StreamResolver';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const fetcher = new FetcherMock(`${__dirname}/__fixtures__/StreamResolver`);
const ctx = createTestContext({ de: 'on', it: 'on' });

const fourKhdHub = new FourKHDHub(fetcher);
const meineCloud = new MeineCloud(fetcher);
const mostraGuarda = new MostraGuarda(fetcher);
const vidSrc = new VidSrc();

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

    const streamsWithShowErrors = await streamResolver.resolve({ ...ctx, config: { ...ctx.config, showErrors: 'on' } }, [meineCloud], 'movie', new ImdbId('tt123456789', undefined, undefined));
    expect(streamsWithShowErrors).toMatchSnapshot();

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

  test('skips fallback sources if possible', async () => {
    const streamResolver = new StreamResolver(logger, new ExtractorRegistry(logger, [new HubCloud(fetcher), new VidSrcExtractor(fetcher, ['vidsrc-embed.ru'])]));

    const streams = await streamResolver.resolve(createTestContext(), [fourKhdHub, vidSrc], 'movie', new TmdbId(812583, undefined, undefined));
    expect(streams.streams).toMatchSnapshot();
  });

  test('keeps fallback sources if needed', async () => {
    const streamResolver = new StreamResolver(logger, new ExtractorRegistry(logger, [new HubCloud(fetcher), new VidSrcExtractor(fetcher, ['vidsrc-embed.ru'])]));

    const streams = await streamResolver.resolve(createTestContext(), [vidSrc], 'movie', new TmdbId(812583, undefined, undefined));
    expect(streams.streams).toMatchSnapshot();
  });

  test('uses priority for sorting', async () => {
    const streamResolver = new StreamResolver(logger, new ExtractorRegistry(logger, [new RgShowsExtractor(fetcher), new VixSrcExtractor(fetcher)]));

    const streams = await streamResolver.resolve(createTestContext(), [new RgShows(fetcher), new VixSrc(fetcher)], 'series', new TmdbId(2190, 26, 2));
    expect(streams.streams).toMatchSnapshot();
  });

  test('adds error info', async () => {
    class MockSource extends Source {
      public readonly id = 'mocksource';

      public readonly label = 'MockSource';

      public readonly contentTypes: ContentType[] = ['movie'];

      public readonly countryCodes: CountryCode[] = [CountryCode.de];

      public readonly baseUrl = 'https://example.com';

      public readonly handleInternal = async (): Promise<SourceResult[]> => {
        return [{ url: new URL('https://example.com'), meta: { countryCodes: [CountryCode.de] } }];
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
            error: new BlockedError(new URL('https://example.com'), BlockedReason.cloudflare_challenge, {}),
            label: 'hoster.com',
            meta: {
              countryCodes: [CountryCode.de],
            },
          },
          {
            url: new URL('https://example.com'),
            format: Format.unknown,
            isExternal: true,
            error: new BlockedError(new URL('https://example.com'), BlockedReason.cloudflare_censor, {}),
            label: 'hoster.com',
            meta: {
              countryCodes: [CountryCode.de],
            },
          },
          {
            url: new URL('https://example.com'),
            format: Format.unknown,
            isExternal: true,
            error: new BlockedError(new URL('https://example.com'), BlockedReason.media_flow_proxy_auth, {}),
            label: 'hoster.com',
            meta: {
              countryCodes: [CountryCode.de],
            },
          },
          {
            url: new URL('https://example.com'),
            format: Format.unknown,
            isExternal: true,
            error: new BlockedError(new URL('https://example.com'), BlockedReason.unknown, {}),
            label: 'hoster.com',
            meta: {
              countryCodes: [CountryCode.de],
            },
          },
          {
            url: new URL('https://working2.com'),
            format: Format.unknown,
            label: 'working1',
            meta: {
              countryCodes: [CountryCode.de],
            },
          },
          {
            url: new URL('https://example.com'),
            format: Format.unknown,
            isExternal: true,
            error: new TooManyRequestsError(new URL('https://example.com'), 10),
            label: 'hoster.com',
            meta: {
              countryCodes: [CountryCode.de],
            },
          },
          {
            url: new URL('https://example.com'),
            format: Format.unknown,
            isExternal: true,
            error: new TooManyTimeoutsError(new URL('https://example.com')),
            label: 'hoster.com',
            meta: {
              countryCodes: [CountryCode.de],
            },
          },
          {
            url: new URL('https://working1.com'),
            format: Format.unknown,
            label: 'working2',
            meta: {
              countryCodes: [CountryCode.de],
            },
          },
          {
            url: new URL('https://example2.com'),
            format: Format.unknown,
            isExternal: true,
            error: new TypeError(),
            label: 'hoster.com',
            meta: {
              countryCodes: [CountryCode.de],
            },
          },
          {
            url: new URL('https://example2.com'),
            format: Format.unknown,
            isExternal: true,
            error: new TimeoutError(new URL('https://example2.com')),
            label: 'hoster.com',
            meta: {
              countryCodes: [CountryCode.de],
            },
          },
          {
            url: new URL('https://example3.com'),
            format: Format.unknown,
            isExternal: true,
            error: new QueueIsFullError(new URL('https://example3.com')),
            label: 'hoster.com',
            meta: {
              countryCodes: [CountryCode.de],
            },
          },
          {
            url: new URL('https://example4.com'),
            format: Format.unknown,
            isExternal: true,
            error: new HttpError(new URL('https://example4.com'), 500, 'Internal Server Error', { 'x-foo': 'bar' }),
            label: 'hoster.com',
            meta: {
              countryCodes: [CountryCode.de],
            },
          },
          {
            url: new URL('https://example5.com'),
            format: Format.unknown,
            isExternal: true,
            error: new HttpError(new URL('https://example5.com'), 418, 'I\'m a tea pot', { 'x-foo': 'bar' }),
            label: 'hoster.com',
            meta: {
              countryCodes: [CountryCode.de],
            },
          },
        ];
    }

    const streamResolver = new StreamResolver(logger, new ExtractorRegistry(logger, [new MockExtractor(fetcher)]));

    const streams = await streamResolver.resolve(ctx, [new MockSource()], 'movie', new ImdbId('tt11655566', undefined, undefined));
    expect(streams).toMatchSnapshot();

    const streamsWithShowErrors = await streamResolver.resolve({ ...ctx, config: { ...ctx.config, showErrors: 'on' } }, [new MockSource()], 'movie', new ImdbId('tt11655566', undefined, undefined));
    expect(streamsWithShowErrors).toMatchSnapshot();
  });

  test('ignores not found errors', async () => {
    class MockSource extends Source {
      public readonly id = 'mocksource';

      public readonly label = 'MockSource';

      public readonly contentTypes: ContentType[] = ['movie'];

      public readonly countryCodes: CountryCode[] = [CountryCode.de];

      public readonly baseUrl = 'https://example.com';

      public readonly handleInternal = async (): Promise<SourceResult[]> => {
        throw new NotFoundError();
      };
    }

    const streamResolver = new StreamResolver(logger, new ExtractorRegistry(logger, createExtractors(fetcher)));

    const streams = await streamResolver.resolve(ctx, [new MockSource()], 'movie', new ImdbId('tt12345678', undefined, undefined));

    expect(streams).toMatchSnapshot();
  });
});
