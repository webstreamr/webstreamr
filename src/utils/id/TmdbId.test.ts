import { TmdbId } from './TmdbId';

describe('can be created from string', () => {
  test('splits id properly', () => {
    const { id, series, episode } = TmdbId.fromString('2085059:2:4');

    expect(id).toBe(2085059);
    expect(series).toBe(2);
    expect(episode).toBe(4);
  });

  test('handles weird 0 prefixes in series and episode', () => {
    const { id, series, episode } = TmdbId.fromString('2085059:02:04');

    expect(id).toBe(2085059);
    expect(series).toBe(2);
    expect(episode).toBe(4);
  });

  test('supports movie with missing series and episode', () => {
    const { id, series, episode } = TmdbId.fromString('2085059');

    expect(id).toBe(2085059);
    expect(series).toBeUndefined();
    expect(episode).toBeUndefined();
  });

  test('throws for empty ids', () => {
    expect(() => {
      TmdbId.fromString('');
    }).toThrow('TMDB ID "" is invalid');
  });

  test('throws for invalid ids', () => {
    expect(() => {
      TmdbId.fromString('foo');
    }).toThrow('TMDB ID "foo" is invalid');
  });
});
