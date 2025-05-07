import { cachedFetchText } from './fetch';

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

describe('fetch', () => {
  test('cachedFetchText throws if the response is not OK', async () => {
    mockedFetch.mockResolvedValue({ ok: false, status: 500, statusText: 'some error happened' });

    await expect(cachedFetchText('https://some-url.test')).rejects.toThrow(new Error('HTTP error: 500 - some error happened'));
  });

  test('cachedFetchText passes response through if it is OK', async () => {
    mockedFetch.mockResolvedValue({ ok: true, text: () => Promise.resolve('some text') });

    const responseText = await cachedFetchText('https://some-url.test');

    expect(responseText).toBe('some text');
  });
});
