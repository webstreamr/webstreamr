import { createTestContext } from '../test';
import { FetcherMock, TmdbId } from '../utils';
import { XPrime } from './XPrime';

const ctx = createTestContext();

describe('XPrime', () => {
  let source: XPrime;

  beforeEach(() => {
    source = new XPrime(new FetcherMock(`${__dirname}/__fixtures__/XPrime`));
  });

  test('handle alien: earth 1x1', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(157239, 1, 1));
    expect(streams).toMatchSnapshot();
  });

  test('handle superman', async () => {
    const streams = await source.handle(ctx, 'series', new TmdbId(1061474, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });
});
