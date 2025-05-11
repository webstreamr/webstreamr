import { Fetcher } from './Fetcher';
import makeFetchHappen from 'make-fetch-happen';

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
  test('text throws if the response is not OK', async () => {
    mockedFetch.mockResolvedValue({ ok: false, status: 500, statusText: 'some error happened' });

    await expect(fetcher.text('https://some-url.test')).rejects.toThrow(new Error('HTTP error: 500 - some error happened'));
  });

  test('text passes response through if it is OK', async () => {
    mockedFetch.mockResolvedValue({ ok: true, text: () => Promise.resolve('some text') });

    const responseText = await fetcher.text('https://some-url.test');

    expect(responseText).toBe('some text');
  });
});
