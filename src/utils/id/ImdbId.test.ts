import { ImdbId } from './ImdbId';

describe('can be created from string', () => {
  test('splits id properly', () => {
    const imdbId = ImdbId.fromString('tt2085059:2:4');

    expect(imdbId.id).toBe('tt2085059');
    expect(imdbId.season).toBe(2);
    expect(imdbId.episode).toBe(4);

    expect(imdbId.toString()).toBe('tt2085059:2:4');
  });

  test('handles weird 0 prefixes in series and episode', () => {
    const imdbId = ImdbId.fromString('tt2085059:02:04');

    expect(imdbId.id).toBe('tt2085059');
    expect(imdbId.season).toBe(2);
    expect(imdbId.episode).toBe(4);

    expect(imdbId.toString()).toBe('tt2085059:2:4');
  });

  test('supports movie with missing series and episode', () => {
    const imdbId = ImdbId.fromString('tt2085059');

    expect(imdbId.id).toBe('tt2085059');
    expect(imdbId.season).toBeUndefined();
    expect(imdbId.episode).toBeUndefined();

    expect(imdbId.toString()).toBe('tt2085059');
  });

  test('throws for empty ids', () => {
    expect(() => {
      ImdbId.fromString('');
    }).toThrow('IMDb ID "" is invalid');
  });

  test('throws for invalid ids', () => {
    expect(() => {
      ImdbId.fromString('foo');
    }).toThrow('IMDb ID "foo" is invalid');
  });
});
