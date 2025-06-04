import winston from 'winston';
import fetchMock from 'fetch-mock';
import { Fetcher } from './Fetcher';
import { Context } from '../types';
import { BlockedError, NotFoundError, QueueIsFullError } from '../error';
fetchMock.mockGlobal();

const fetcher = new Fetcher(winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] }), 3, 10);

describe('fetch', () => {
  const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { de: 'on' } };

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
        'Forwarded': 'for=127.0.0.1',
        'Priority': 'u=0',
        'Referer': 'https://some-url.test',
        'User-Agent': 'node',
        'X-Forwarded-For': '127.0.0.1',
        'X-Forwarded-Proto': 'https',
        'X-Real-IP': '127.0.0.1',
      },
    });
  });

  test('textPost ', async () => {
    fetchMock.post('https://some-post-url.test/', 'some text');

    expect(await fetcher.textPost(ctx, new URL('https://some-post-url.test/'), { foo: 'bar' })).toBe('some text');
  });

  test('head', async () => {
    fetchMock.head('https://some-head-url.test/', { status: 200, headers: { 'X-Fake-Response': 'foo' } });

    expect(await fetcher.head(ctx, new URL('https://some-head-url.test/'))).toMatchObject({ 'x-fake-response': 'foo' });
  });

  test('uses context referer', async () => {
    fetchMock.get('https://some-referer-url.test/', 'some text');

    await fetcher.text({ ...ctx, referer: new URL('https://example.com/foo/bar') }, new URL('https://some-referer-url.test/'));

    expect(fetchMock.callHistory.callLogs[0]?.args[1]).toMatchObject({
      headers: {
        Referer: 'https://example.com/foo/bar',
      },
    });
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
      expect(error).toMatchObject({ reason: 'cloudflare_challenge' });
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
      expect(error).toMatchObject({ reason: 'flaresolverr_failed' });
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
      expect(error).toMatchObject({ reason: 'unknown' });
    }
  });

  test('passes through other errors with detailed infos', async () => {
    fetchMock.get('https://some-error-url.test/', { status: 500, headers: { 'x-foo': 'bar' } });

    await expect(fetcher.text(ctx, new URL('https://some-error-url.test/'))).rejects
      .toThrow('Fetcher error: 500: Internal Server Error, response headers: {"content-length":"0","x-foo":"bar","age":"0","date":"Wed, 11 Apr 1990 12:34:56 GMT"}');
  });

  test('passes through exceptions', async () => {
    fetchMock.get('https://some-exception-url.test/', { throws: new TypeError('Failed to fetch') });

    await expect(fetcher.text(ctx, new URL('https://some-exception-url.test/'))).rejects.toBeInstanceOf(TypeError);
  });

  test('times out after 10 seconds', async () => {
    fetchMock.get('https://some-timeout-url.test/', 200, { delay: 20 });

    await expect(fetcher.text(ctx, new URL('https://some-timeout-url.test/'))).rejects.toBeInstanceOf(DOMException);
  });

  test('full queue throws an error', async () => {
    fetchMock.get('https://some-full-queue-url.test/', 'some text');

    const allPromises = Promise.all([
      fetcher.text(ctx, new URL('https://some-full-queue-url.test/')),
      fetcher.text(ctx, new URL('https://some-full-queue-url.test/')),
      fetcher.text(ctx, new URL('https://some-full-queue-url.test/')),
      fetcher.text(ctx, new URL('https://some-full-queue-url.test/')),
    ]);

    await expect(allPromises).rejects.toBeInstanceOf(QueueIsFullError);
  });
});
