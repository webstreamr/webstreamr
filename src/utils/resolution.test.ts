import { scanFromResolution } from './resolution';

describe('scanFromResolution', () => {
  test.each([
    ['720p', '1280x720'],
    ['720p', '1280 x 720 '],
    ['240p', '352x240'],
    ['240p', '352x240'],
    ['480p', '720x480'],
    ['1080p', '1280x1080'],
    ['2160p', '3840x2160'],
    ['4320p', '7680x4320'],
  ])('returns %s with %s', (output, input) => {
    expect(scanFromResolution(input)).toBe(output);
  });

  test('logs and returns undefined for invalid resolution', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(scanFromResolution('foo')).toBe(undefined);

    expect(consoleWarnSpy).toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('"foo" is not a valid resolution'));
  });
});
