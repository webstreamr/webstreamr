import { ImdbId } from './ImdbId';

describe('can be created from string', () => {
  test('splits id properly', () => {
    const { id, season, episode } = ImdbId.fromString('tt2085059:2:4');

    expect(id).toBe('tt2085059');
    expect(season).toBe(2);
    expect(episode).toBe(4);
  });

  test('handles weird 0 prefixes in series and episode', () => {
    const { id, season, episode } = ImdbId.fromString('tt2085059:02:04');

    expect(id).toBe('tt2085059');
    expect(season).toBe(2);
    expect(episode).toBe(4);
  });

  test('supports movie with missing series and episode', () => {
    const { id, season, episode } = ImdbId.fromString('tt2085059');

    expect(id).toBe('tt2085059');
    expect(season).toBeUndefined();
    expect(episode).toBeUndefined();
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
