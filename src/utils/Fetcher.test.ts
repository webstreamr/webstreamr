import { Agent, ProxyAgent } from 'undici';
import winston from 'winston';
import fetchMock from 'fetch-mock';
import { Fetcher } from './Fetcher';
import { BlockedError, HttpError, NotFoundError, QueueIsFullError, TimeoutError, TooManyRequestsError, TooManyTimeoutsError } from '../error';
import { createTestContext } from '../test';
import { BlockedReason } from '../types';
fetchMock.mockGlobal();

const fetcher = new Fetcher(winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] }));

describe('fetch', () => {
  const ctx = { ...createTestContext(), ip: '0.0.0.0' };

  afterEach(() => {
    fetchMock.clearHistory();
  });

  test('text passes successful response through setting headers', async () => {
    fetchMock.get('https://some-url.test/', 'some text');

    const responseText1 = await fetcher.text(ctx, new URL('https://some-url.test/'));
    const responseText2 = await fetcher.text(ctx, new URL('https://some-url.test/'), { headers: { 'User-Agent': 'jest' } });

    expect(responseText1).toBe('some text');
    expect(responseText2).toStrictEqual(responseText1);

    expect(fetchMock.callHistory.callLogs[0]?.args[1]).toMatchObject({
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en',
        'Forwarded': 'for=0.0.0.0',
        'Priority': 'u=0',
        'User-Agent': 'node',
        'X-Forwarded-For': '0.0.0.0',
        'X-Forwarded-Proto': 'https',
        'X-Real-IP': '0.0.0.0',
      },
    });
  });

  test('supports socks5 proxy', async () => {
    process.env['ALL_PROXY'] = 'socks5://127.0.0.1:1080';
    const socks5Fetcher = new Fetcher(winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] }));
    delete process.env['MANIFEST_NAME'];
    fetchMock.get('https://socks5-proxy-url.test/', 'some text');

    await socks5Fetcher.text(ctx, new URL('https://socks5-proxy-url.test/'));

    // @ts-expect-error non-official property
    expect(fetchMock.callHistory.callLogs[0]?.args[1]['dispatcher']).toBeInstanceOf(Agent);
  });

  test('supports http proxy', async () => {
    process.env['ALL_PROXY'] = 'https://127.0.0.1:8080';
    const socks5Fetcher = new Fetcher(winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] }));
    delete process.env['MANIFEST_NAME'];
    fetchMock.get('https://http-proxy-url.test/', 'some text');

    await socks5Fetcher.text(ctx, new URL('https://http-proxy-url.test/'));

    // @ts-expect-error non-official property
    expect(fetchMock.callHistory.callLogs[0]?.args[1]['dispatcher']).toBeInstanceOf(ProxyAgent);
  });

  test('textPost ', async () => {
    fetchMock.post('https://some-post-url.test/', 'some text');

    expect(await fetcher.textPost(ctx, new URL('https://some-post-url.test/'), JSON.stringify({ foo: 'bar' }))).toBe('some text');
  });

  test('head', async () => {
    fetchMock.head('https://some-head-url.test/', { status: 200, headers: { 'X-Fake-Response': 'foo' } });

    expect(await fetcher.head(ctx, new URL('https://some-head-url.test/'))).toMatchObject({ 'x-fake-response': 'foo' });
  });

  test('converts 404 to custom NotFoundError', async () => {
    fetchMock.get('https://some-404-url.test/', 404);

    await expect(fetcher.text(ctx, new URL('https://some-404-url.test/'))).rejects.toBeInstanceOf(NotFoundError);
  });

  test('converts Cloudflare challenge block to custom BlockedError', async () => {
    fetchMock.get('https://some-cloudflare-url.test/', { status: 403, headers: { 'cf-mitigated': 'challenge' } });

    try {
      await fetcher.text(ctx, new URL('https://some-cloudflare-url.test/'));
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(BlockedError);
      expect(error).toMatchObject({ reason: BlockedReason.cloudflare_challenge });
    }
  });

  test('uses FlareSolverr to solve Cloudflare challenge if configured and succeeds', async () => {
    process.env['FLARESOLVERR_ENDPOINT'] = 'http://localhost:8191/v1/x';
    fetchMock.get('https://some-cloudflare-flaresolverr-success-url.test/', { status: 403, headers: { 'cf-mitigated': 'challenge' } });
    fetchMock.post(
      'http://localhost:8191/v1/x',
      {
        body: {
          status: 'ok',
          solution: {
            response: 'some response',
            cookies: [
              { name: 'cf_clearance', value: 'some_value', expires: Date.now() / 1000 + 12345, domain: 'some-cloudflare-flaresolverr-success-url.test' },
              { name: 'irrelevant', value: 'some_other_value', expires: Date.now() / 1000 + 12345, domain: 'some-other.domain' },
            ],
            userAgent: 'user agent that works',
          },
        },
      },
    );

    const response = await fetcher.text(ctx, new URL('https://some-cloudflare-flaresolverr-success-url.test/'));
    expect(response).toBe('some response');

    // The next request has to use the cookie and user agent we got
    await fetcher.text(ctx, new URL('https://some-cloudflare-flaresolverr-success-url.test/'));
    expect(fetchMock.callHistory.callLogs[2]?.args[1]).toMatchObject({
      headers: {
        'Cookie': 'cf_clearance=some_value',
        'User-Agent': 'user agent that works',
      },
    });

    delete process.env['FLARESOLVERR_ENDPOINT'];
  });

  test('uses FlareSolverr to solve Cloudflare challenge if configured and fails with custom BlockedError', async () => {
    process.env['FLARESOLVERR_ENDPOINT'] = 'http://localhost:8191/v1/y';
    fetchMock.get('https://some-cloudflare-flaresolverr-fail-url.test/', { status: 403, headers: { 'cf-mitigated': 'challenge' } });
    fetchMock.post('http://localhost:8191/v1/y', { body: { status: 'nok' } });

    try {
      await fetcher.text(ctx, new URL('https://some-cloudflare-flaresolverr-fail-url.test/'));
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(BlockedError);
      expect(error).toMatchObject({ reason: BlockedReason.flaresolverr_failed });
    }

    delete process.env['FLARESOLVERR_ENDPOINT'];
  });

  test('converts generic forbidden to custom BlockedError', async () => {
    fetchMock.get('https://some-forbidden-url.test/', { status: 403 });

    try {
      await fetcher.text(ctx, new URL('https://some-forbidden-url.test/'));
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(BlockedError);
      expect(error).toMatchObject({ reason: BlockedReason.unknown });
    }
  });

  test('converts MediaFlow Proxy forbidden to custom BlockedError', async () => {
    fetchMock.get('https://media-flow-proxy-forbidden-url.test/', { status: 403 });

    try {
      await fetcher.text(createTestContext({ mediaFlowProxyUrl: 'https://media-flow-proxy-forbidden-url.test/' }), new URL('https://media-flow-proxy-forbidden-url.test/'));
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(BlockedError);
      expect(error).toMatchObject({ reason: BlockedReason.media_flow_proxy_auth });
    }
  });

  test('converts 429 to custom TooManyRequestsError', async () => {
    fetchMock.get('https://some-rate-limited-url.test/', { status: 429 });

    try {
      await fetcher.text(ctx, new URL('https://some-rate-limited-url.test/'));
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(TooManyRequestsError);
      expect(error).toMatchObject({ retryAfter: NaN });
    }
  });

  test('converts 429 to custom TooManyRequestsError and blocks consecutive requests', async () => {
    fetchMock.get('https://some-rate-limited-retry-after-url.test/', { status: 429, headers: { 'retry-after': '10' } });

    try {
      await fetcher.text(ctx, new URL('https://some-rate-limited-retry-after-url.test/'));
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(TooManyRequestsError);
      expect(error).toMatchObject({ retryAfter: 10 });
    }

    try {
      await fetcher.text(ctx, new URL('https://some-rate-limited-retry-after-url.test/'));
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(TooManyRequestsError);
    }
  });

  test('passes through other error as HttpError', async () => {
    fetchMock.get('https://some-error-url.test/', { status: 500, headers: { 'x-foo': 'bar' } });

    try {
      await fetcher.text(ctx, new URL('https://some-error-url.test/'));
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error).toMatchObject({ status: 500, headers: { 'x-foo': 'bar' } });
    }
  });

  test('passes through exceptions', async () => {
    fetchMock.get('https://some-exception-url.test/', { throws: new TypeError('Failed to fetch') });

    await expect(fetcher.text(ctx, new URL('https://some-exception-url.test/'))).rejects.toBeInstanceOf(TypeError);
  });

  test('times out', async () => {
    fetchMock.get('https://some-timeout-url.test/', 200, { delay: 20 });

    await expect(fetcher.text(ctx, new URL('https://some-timeout-url.test/'), { timeout: 10 })).rejects.toBeInstanceOf(TimeoutError);
  });

  test('queues requests and throws if queue is full', async () => {
    fetchMock.get('https://some-full-queue-url.test/', 200, { delay: 20 });

    const allPromises = Promise.all([
      fetcher.text(ctx, new URL('https://some-full-queue-url.test/'), { queueLimit: 1, queueTimeout: 10 }),
      fetcher.text(ctx, new URL('https://some-full-queue-url.test/'), { queueLimit: 1, queueTimeout: 10 }),
      fetcher.text(ctx, new URL('https://some-full-queue-url.test/'), { queueLimit: 1, queueTimeout: 10 }),
      fetcher.text(ctx, new URL('https://some-full-queue-url.test/'), { queueLimit: 1, queueTimeout: 10 }),
      fetcher.text(ctx, new URL('https://some-full-queue-url.test/'), { queueLimit: 1, queueTimeout: 10 }),
    ]);

    await expect(allPromises).rejects.toBeInstanceOf(QueueIsFullError);
  });

  test('throws if too many recent requests timed-out', async () => {
    fetchMock.get('https://too-many-recent-timeouts-url.test/', 200, { delay: 20 });

    await expect(fetcher.text(ctx, new URL('https://too-many-recent-timeouts-url.test/'), { timeout: 10, timeoutsCountThrow: 2 })).rejects.toBeInstanceOf(TimeoutError);
    await expect(fetcher.text(ctx, new URL('https://too-many-recent-timeouts-url.test/'), { timeout: 10, timeoutsCountThrow: 2 })).rejects.toBeInstanceOf(TimeoutError);
    await expect(fetcher.text(ctx, new URL('https://too-many-recent-timeouts-url.test/'), { timeout: 10, timeoutsCountThrow: 2 })).rejects.toBeInstanceOf(TooManyTimeoutsError);
  });
});
