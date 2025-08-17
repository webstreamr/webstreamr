import { createTestContext } from '../test';
import { FetcherMock, ImdbId } from '../utils';
import { MostraGuarda } from './MostraGuarda';

const ctx = createTestContext({ it: 'on' });

describe('MostraGuarda', () => {
  let source: MostraGuarda;

  beforeEach(() => {
    source = new MostraGuarda(new FetcherMock(`${__dirname}/__fixtures__/MostraGuarda`));
  });

  test('handles non-existent movies gracefully', async () => {
    const streams = await source.handle(ctx, 'movie', new ImdbId('tt12345678', undefined, undefined));
    expect(streams).toHaveLength(0);
  });

  test('handle imdb the devil\'s bath', async () => {
    const streams = await source.handle(ctx, 'movie', new ImdbId('tt29141112', undefined, undefined));
    expect(streams).toMatchSnapshot();
  });
});
