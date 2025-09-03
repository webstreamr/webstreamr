import { Source } from './Source';

describe('Source', () => {
  test('stats returns something', async () => {
    const stats = Source.stats();

    expect(stats).toHaveProperty('sourceResultCache');
    expect(stats.sourceResultCache).toBeTruthy();
  });
});
