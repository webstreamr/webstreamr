import { createTestContext } from '../test';
import { FetcherMock, ImdbId } from '../utils';
import { VerHdLink } from './VerHdLink';

const ctx = createTestContext({ es: 'on', mx: 'on' });

describe('VerHdLink', () => {
  let handler: VerHdLink;

  beforeEach(() => {
    handler = new VerHdLink(new FetcherMock(`${__dirname}/__fixtures__/VerHdLink`));
  });

  test('handles non-existent movies gracefully', async () => {
    const streams = await handler.handle(ctx, 'movie', new ImdbId('tt12345678', undefined, undefined));
    expect(streams).toHaveLength(0);
  });

  test('handle titanic', async () => {
    const streams = await handler.handle(ctx, 'movie', new ImdbId('tt0120338', undefined, undefined));
    expect(streams).toMatchSnapshot();
  });
});
