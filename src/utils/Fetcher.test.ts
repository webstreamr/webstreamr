import winston from 'winston';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import { Fetcher } from './Fetcher';
import { Context } from '../types';

const axiosMock = new AxiosMockAdapter(axios);

const fetcher = new Fetcher(axios, winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] }));

describe('fetch', () => {
  const ctx: Context = { ip: '127.0.0.1' };

  test('text passes successful response through setting headers', async () => {
    axiosMock.onGet().reply(200, 'some text');
    const axiosSpy = jest.spyOn(axios, 'get');

    const responseText1 = await fetcher.text(ctx, new URL('https://some-url.test/'));
    const responseText2 = await fetcher.text(ctx, new URL('https://some-url.test/'), { headers: { 'User-Agent': 'jest' } });

    expect(responseText1).toBe('some text');
    expect(responseText2).toStrictEqual(responseText1);

    expect(axiosSpy).toHaveBeenCalledWith(
      'https://some-url.test/', {
        headers: {
          'User-Agent': expect.not.stringMatching(/jest/),
          'Forwarded': 'for=127.0.0.1',
          'X-Forwarded-For': '127.0.0.1',
          'X-Forwarded-Proto': 'https',
          'X-Real-IP': '127.0.0.1',
        },
      },
    );
  });
});
