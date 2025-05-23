import winston from 'winston';
import axios, { AxiosError } from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import { Fetcher } from './Fetcher';
import { Context } from '../types';
import { NotFoundError } from '../error';

const axiosMock = new AxiosMockAdapter(axios);

const fetcher = new Fetcher(axios, winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] }));

describe('fetch', () => {
  const ctx: Context = { id: 'id', ip: '127.0.0.1', config: { de: 'on' } };

  test('text passes successful response through setting headers', async () => {
    axiosMock.onGet().reply(200, 'some text');
    const axiosSpy = jest.spyOn(axios, 'get');

    const responseText1 = await fetcher.text(ctx, new URL('https://some-url.test/'));
    const responseText2 = await fetcher.text(ctx, new URL('https://some-url.test/'), { headers: { 'User-Agent': 'jest' } });

    expect(responseText1).toBe('some text');
    expect(responseText2).toStrictEqual(responseText1);

    expect(axiosSpy).toHaveBeenCalledWith(
      'https://some-url.test/',
      {
        headers: {
          'Forwarded': 'for=127.0.0.1',
          'Origin': 'https://some-url.test',
          'User-Agent': expect.not.stringMatching(/jest/),
          'Referer': 'https://some-url.test',
          'X-Forwarded-For': '127.0.0.1',
          'X-Forwarded-Proto': 'https',
          'X-Real-IP': '127.0.0.1',
        },
        responseType: 'text',
        timeout: 15000,
      },
    );
  });

  test('textPost passes successful response through setting headers', async () => {
    axiosMock.onPost().reply(200, 'some text');
    const axiosSpy = jest.spyOn(axios, 'post');

    const responseText1 = await fetcher.textPost(ctx, new URL('https://some-url.test/'), { foo: 'bar' });
    const responseText2 = await fetcher.textPost(ctx, new URL('https://some-url.test/'), { foo: 'bar' }, { headers: { 'User-Agent': 'jest' } });

    expect(responseText1).toBe('some text');
    expect(responseText2).toStrictEqual(responseText1);

    expect(axiosSpy).toHaveBeenCalledWith(
      'https://some-url.test/',
      {
        foo: 'bar',
      },
      {
        headers: {
          'Forwarded': 'for=127.0.0.1',
          'Origin': 'https://some-url.test',
          'User-Agent': expect.not.stringMatching(/jest/),
          'Referer': 'https://some-url.test',
          'X-Forwarded-For': '127.0.0.1',
          'X-Forwarded-Proto': 'https',
          'X-Real-IP': '127.0.0.1',
        },
        responseType: 'text',
        timeout: 15000,
      },
    );

    expect(axiosSpy).toHaveBeenCalledWith(
      'https://some-url.test/',
      {
        foo: 'bar',
      },
      {
        headers: {
          'Forwarded': 'for=127.0.0.1',
          'Origin': 'https://some-url.test',
          'User-Agent': 'jest',
          'Referer': 'https://some-url.test',
          'X-Forwarded-For': '127.0.0.1',
          'X-Forwarded-Proto': 'https',
          'X-Real-IP': '127.0.0.1',
        },
        responseType: 'text',
        timeout: 15000,
      },
    );
  });

  test('head passes successful response through setting headers', async () => {
    axiosMock.onHead().reply(200, undefined, { 'X-Fake-Response': 'foo' });
    const axiosSpy = jest.spyOn(axios, 'head');

    const responseHeaders1 = await fetcher.head(ctx, new URL('https://some-url.test/'));
    const responseHeaders2 = await fetcher.head(ctx, new URL('https://some-url.test/'), { headers: { 'User-Agent': 'jest' } });

    expect(responseHeaders1).toMatchObject({ 'X-Fake-Response': 'foo' });
    expect(responseHeaders2).toStrictEqual(responseHeaders1);

    expect(axiosSpy).toHaveBeenCalledWith(
      'https://some-url.test/',
      {
        headers: {
          'Forwarded': 'for=127.0.0.1',
          'Origin': 'https://some-url.test',
          'User-Agent': expect.not.stringMatching(/jest/),
          'Referer': 'https://some-url.test',
          'X-Forwarded-For': '127.0.0.1',
          'X-Forwarded-Proto': 'https',
          'X-Real-IP': '127.0.0.1',
        },
        responseType: 'text',
        timeout: 15000,
      },
    );
  });

  test('converts 404 to custom NotFoundError', async () => {
    axiosMock.onGet().reply(404);

    await expect(fetcher.text(ctx, new URL('https://some-url.test/'))).rejects.toBeInstanceOf(NotFoundError);
  });

  test('passes through other errors', async () => {
    axiosMock.onGet().networkError();

    await expect(fetcher.text(ctx, new URL('https://some-url.test/'))).rejects.toBeInstanceOf(AxiosError);
  });
});
