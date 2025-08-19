import { createTestContext } from '../test';
import { FetcherMock, TmdbId } from '../utils';
import { Einschalten } from './Einschalten';

const ctx = createTestContext({ de: 'on' });

describe('Einschalten', () => {
  let source: Einschalten;

  beforeEach(() => {
    source = new Einschalten(new FetcherMock(`${__dirname}/__fixtures__/Einschalten`));
  });

  test('handle superman', async () => {
    const streams = await source.handle(ctx, 'movie', new TmdbId(1061474, undefined, undefined));
    expect(streams).toMatchSnapshot();
  });
});
