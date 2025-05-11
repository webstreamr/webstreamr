import { Fetcher } from './Fetcher';
import makeFetchHappen from 'make-fetch-happen';
import { Context } from '../types';

global.console = {
  ...console,
  error: jest.fn(),
  info: jest.fn(),
};

const mockedFetch = jest.fn();
jest.mock('make-fetch-happen', () => ({
  __esModule: true,
  default: {
    defaults: () => mockedFetch,
  },
}));

const fetcher = new Fetcher(makeFetchHappen.defaults());

describe('fetch', () => {
  const ctx: Context = { ip: '127.0.0.1' };

  test('text throws if the response is not OK', async () => {
    mockedFetch.mockResolvedValue({ ok: false, status: 500, statusText: 'some error happened' });

    await expect(fetcher.text(ctx, 'https://some-url.test')).rejects.toThrow(new Error('HTTP error: 500 - some error happened'));
  });

  test('text passes successful response through setting headers', async () => {
    mockedFetch.mockResolvedValue({ ok: true, text: () => Promise.resolve('some text') });

    const responseText = await fetcher.text(ctx, 'https://some-url.test', { headers: { 'User-Agent': 'jest' } });

    expect(responseText).toBe('some text');
    expect(mockedFetch).toHaveBeenCalledWith(
      'https://some-url.test',
      { headers: { 'User-Agent': 'jest', 'X-Forwarded-For': '127.0.0.1' } },
    );
  });
});
