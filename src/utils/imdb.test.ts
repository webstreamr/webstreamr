import { parseImdbId } from './imdb';

describe('imdb id parsing', () => {
  test('splits id properly', () => {
    const { id, series, episode } = parseImdbId('tt2085059:2:4');

    expect(id).toBe('tt2085059');
    expect(series).toBe(2);
    expect(episode).toBe(4);
  });

  test('handles weird 0 prefixes in series and episode', () => {
    const { id, series, episode } = parseImdbId('tt2085059:02:04');

    expect(id).toBe('tt2085059');
    expect(series).toBe(2);
    expect(episode).toBe(4);
  });

  test('supports movie with missing series and episode', () => {
    const { id, series, episode } = parseImdbId('tt2085059');

    expect(id).toBe('tt2085059');
    expect(series).toBeUndefined();
    expect(episode).toBeUndefined();
  });

  test('throws for empty ids', () => {
    expect(() => {
      parseImdbId('');
    }).toThrow('IMDb ID "" is invalid');
  });

  test('throws for invalid ids', () => {
    expect(() => {
      parseImdbId('foo');
    }).toThrow('IMDb ID "foo" is invalid');
  });
});
