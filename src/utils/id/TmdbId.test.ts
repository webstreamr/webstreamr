import { TmdbId } from './TmdbId';

describe('can be created from string', () => {
  test('splits id properly', () => {
    const tmdbId = TmdbId.fromString('2085059:2:4');

    expect(tmdbId.id).toBe(2085059);
    expect(tmdbId.season).toBe(2);
    expect(tmdbId.episode).toBe(4);

    expect(tmdbId.toString()).toBe('2085059:2:4');
  });

  test('handles weird 0 prefixes in series and episode', () => {
    const tmdbId = TmdbId.fromString('2085059:02:04');

    expect(tmdbId.id).toBe(2085059);
    expect(tmdbId.season).toBe(2);
    expect(tmdbId.episode).toBe(4);

    expect(tmdbId.toString()).toBe('2085059:2:4');
  });

  test('supports movie with missing series and episode', () => {
    const tmdbId = TmdbId.fromString('2085059');

    expect(tmdbId.id).toBe(2085059);
    expect(tmdbId.season).toBeUndefined();
    expect(tmdbId.episode).toBeUndefined();

    expect(tmdbId.toString()).toBe('2085059');
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
