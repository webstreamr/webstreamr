import { MockAgent, setGlobalDispatcher } from 'undici';
import winston from 'winston';
import { BlockedError, HttpError, NotFoundError, QueueIsFullError, TimeoutError, TooManyRequestsError, TooManyTimeoutsError } from '../error';
import { createTestContext } from '../test';
import { BlockedReason } from '../types';
import { Fetcher } from './Fetcher';

let mockAgent: MockAgent;
const fetcher = new Fetcher(winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] }));

describe('fetch', () => {
  const ctx = { ...createTestContext(), ip: '0.0.0.0' };

  beforeEach(() => {
    mockAgent = new MockAgent({ enableCallHistory: true });
    mockAgent.disableNetConnect();
    setGlobalDispatcher(mockAgent);
  });

  test('text passes successful response through setting headers', async () => {
    const mockPool = mockAgent.get('https://some-url.test');
    mockPool.intercept({ path: '/' }).reply(200, 'some text');

    const responseText1 = await fetcher.text(ctx, new URL('https://user:pass@some-url.test/'));
    const responseText2 = await fetcher.text(ctx, new URL('https://user:pass@some-url.test/'), { headers: { 'User-Agent': 'jest' } });

    expect(responseText1).toBe('some text');
    expect(responseText2).toStrictEqual(responseText1);

    expect(mockAgent.getCallHistory()?.firstCall()?.headers).toMatchObject({
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en',
      'Authorization': 'Basic dXNlcjpwYXNz',
      'Forwarded': 'for=0.0.0.0',
      'Priority': 'u=0',
      'User-Agent': 'node',
      'X-Forwarded-For': '0.0.0.0',
      'X-Forwarded-Proto': 'https',
      'X-Real-IP': '0.0.0.0',
    });
  });

  test('textPost ', async () => {
    const mockPool = mockAgent.get('https://some-post-url.test');
    mockPool.intercept({ path: '/', method: 'POST' }).reply(200, 'some text');

    expect(await fetcher.textPost(ctx, new URL('https://some-post-url.test/'), JSON.stringify({ foo: 'bar' }))).toBe('some text');
  });

  test('head', async () => {
    const mockPool = mockAgent.get('https://some-head-url.test');
    mockPool.intercept({ path: '/', method: 'HEAD' }).reply(200, 'some text', { headers: { 'X-Fake-Response': 'foo' } });

    expect(await fetcher.head(ctx, new URL('https://some-head-url.test/'))).toMatchObject({ 'x-fake-response': 'foo' });
  });

  test('converts 404 to custom NotFoundError', async () => {
    const mockPool = mockAgent.get('https://some-404-url.test');
    mockPool.intercept({ path: '/' }).reply(404);

    await expect(fetcher.text(ctx, new URL('https://some-404-url.test/'))).rejects.toBeInstanceOf(NotFoundError);
  });

  test('converts Cloudflare challenge block to custom BlockedError', async () => {
    const mockPool = mockAgent.get('https://some-cloudflare-url.test');
    mockPool.intercept({ path: '/' }).reply(403, undefined, { headers: { 'cf-mitigated': 'challenge' } });

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
    const mockPool = mockAgent.get('https://some-cloudflare-flaresolverr-success-url.test');
    mockPool.intercept({ path: '/' }).reply(403, undefined, { headers: { 'cf-mitigated': 'challenge' } });
    const mockPool2 = mockAgent.get('http://localhost:8191');
    mockPool2.intercept({ path: '/v1/x', method: 'POST' }).reply(
      200,
      {
        status: 'ok',
        solution: {
          response: 'some response',
          cookies: [
            {
              name: 'cf_clearance',
              value: 'some_value',
              expires: Date.now() / 1000 + 12345,
              domain: 'some-cloudflare-flaresolverr-success-url.test',
            },
            {
              name: 'irrelevant',
              value: 'some_other_value',
              expires: Date.now() / 1000 + 12345,
              domain: 'some-other.domain',
            },
          ],
          userAgent: 'user agent that works',
        },
      },
    );

    const response = await fetcher.text(ctx, new URL('https://some-cloudflare-flaresolverr-success-url.test/'));
    expect(response).toBe('some response');

    // The next request has to use the cookie and user agent we got
    mockPool.intercept({ path: '/' }).reply(200, 'some response');
    await fetcher.text(ctx, new URL('https://some-cloudflare-flaresolverr-success-url.test/'));
    expect(mockAgent.getCallHistory()?.calls()[2]?.headers).toMatchObject({
      'Cookie': 'cf_clearance=some_value',
      'User-Agent': 'user agent that works',
    });

    delete process.env['FLARESOLVERR_ENDPOINT'];
  });

  test('uses FlareSolverr to solve Cloudflare challenge if configured and fails with custom BlockedError', async () => {
    process.env['FLARESOLVERR_ENDPOINT'] = 'http://localhost:8191/v1/y';
    const mockPool = mockAgent.get('https://some-cloudflare-flaresolverr-fail-url.test');
    mockPool.intercept({ path: '/' }).reply(403, undefined, { headers: { 'cf-mitigated': 'challenge' } });
    const mockPool2 = mockAgent.get('http://localhost:8191');
    mockPool2.intercept({ path: '/v1/y', method: 'POST' }).reply(200, { status: 'nok' });

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
    const mockPool = mockAgent.get('https://some-forbidden-url.test');
    mockPool.intercept({ path: '/' }).reply(403);

    try {
      await fetcher.text(ctx, new URL('https://some-forbidden-url.test/'));
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(BlockedError);
      expect(error).toMatchObject({ reason: BlockedReason.unknown });
    }
  });

  test('converts cloudflare 451 to custom BlockedError', async () => {
    const mockPool = mockAgent.get('https://some-cloudflare-forbidden-url.test');
    mockPool.intercept({ path: '/' }).reply(451);

    try {
      await fetcher.text(ctx, new URL('https://some-cloudflare-forbidden-url.test/'));
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(BlockedError);
      expect(error).toMatchObject({ reason: BlockedReason.cloudflare_censor });
    }
  });

  test('converts MediaFlow Proxy forbidden to custom BlockedError', async () => {
    const mockPool = mockAgent.get('https://media-flow-proxy-forbidden-url.test');
    mockPool.intercept({ path: '/' }).reply(403);

    try {
      await fetcher.text(createTestContext({ mediaFlowProxyUrl: 'https://media-flow-proxy-forbidden-url.test/' }), new URL('https://media-flow-proxy-forbidden-url.test/'));
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(BlockedError);
      expect(error).toMatchObject({ reason: BlockedReason.media_flow_proxy_auth });
    }
  });

  test('converts 429 to custom TooManyRequestsError', async () => {
    const mockPool = mockAgent.get('https://some-rate-limited-url.test');
    mockPool.intercept({ path: '/' }).reply(429);

    try {
      await fetcher.text(ctx, new URL('https://some-rate-limited-url.test/'));
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(TooManyRequestsError);
      expect(error).toMatchObject({ retryAfter: NaN });
    }
  });

  test('converts 429 to custom TooManyRequestsError and blocks consecutive requests', async () => {
    const mockPool = mockAgent.get('https://some-rate-limited-retry-after-url.test');
    mockPool.intercept({ path: '/' }).reply(429, undefined, { headers: { 'retry-after': '60' } });
    mockPool.intercept({ path: '/' }).reply(200);

    try {
      await fetcher.text(ctx, new URL('https://some-rate-limited-retry-after-url.test/'));
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(TooManyRequestsError);
      expect(error).toMatchObject({ retryAfter: 60 });
    }

    try {
      await fetcher.text(ctx, new URL('https://some-rate-limited-retry-after-url.test/'));
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(TooManyRequestsError);
    }
  });

  test('retries rate limits with short ttl', async () => {
    const mockPool = mockAgent.get('https://some-rate-limited-retry-after-short-url.test');
    mockPool.intercept({ path: '/' }).reply(429, undefined, { headers: { 'retry-after': '1' } });
    mockPool.intercept({ path: '/' }).reply(200);

    const responseText = await fetcher.text(ctx, new URL('https://some-rate-limited-retry-after-short-url.test/'));
    expect(responseText).toBe('');
  });

  test('passes through other error as HttpError after retrying 3 times', async () => {
    const mockPool = mockAgent.get('https://some-error-url.test');
    mockPool.intercept({ path: '/' }).reply(500, undefined, { headers: { 'x-foo': 'bar' } }).times(4);

    try {
      await fetcher.text(ctx, new URL('https://some-error-url.test/'));
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error).toMatchObject({ status: 500, headers: { 'x-foo': 'bar' } });
    }
  });

  test('passes through exceptions', async () => {
    const mockPool = mockAgent.get('https://some-error-url.test');
    mockPool.intercept({ path: '/' }).replyWithError((new TypeError('Failed to fetch')));

    await expect(fetcher.text(ctx, new URL('https://some-exception-url.test/'))).rejects.toBeInstanceOf(TypeError);
  });

  test('times out, retries and times out again', async () => {
    const mockPool = mockAgent.get('https://some-timeout-url.test');
    mockPool.intercept({ path: '/' }).reply(200).delay(20).persist();

    await expect(fetcher.text(ctx, new URL('https://some-timeout-url.test/'), { timeout: 10 })).rejects.toBeInstanceOf(TimeoutError);
  });

  test('queues requests and throws if queue is full', async () => {
    const mockPool = mockAgent.get('https://some-full-queue-url.test');
    mockPool.intercept({ path: '/' }).reply(200).delay(20).persist();

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
    const mockPool = mockAgent.get('https://too-many-recent-timeouts-url.test');
    mockPool.intercept({ path: '/' }).reply(200).delay(20).persist();

    await expect(fetcher.text(ctx, new URL('https://too-many-recent-timeouts-url.test/'), { timeout: 10, timeoutsCountThrow: 2 })).rejects.toBeInstanceOf(TimeoutError);
    await expect(fetcher.text(ctx, new URL('https://too-many-recent-timeouts-url.test/'), { timeout: 10, timeoutsCountThrow: 2 })).rejects.toBeInstanceOf(TimeoutError);
    await expect(fetcher.text(ctx, new URL('https://too-many-recent-timeouts-url.test/'), { timeout: 10, timeoutsCountThrow: 2 })).rejects.toBeInstanceOf(TooManyTimeoutsError);
  });

  test('stats returns something', async () => {
    const stats = fetcher.stats();

    expect(stats).toHaveProperty('httpCache');
    expect(stats.httpCache).toBeTruthy();
  });
});
