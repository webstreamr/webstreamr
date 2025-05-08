import { logError, logInfo, logWarn } from './log';

describe('log', () => {
  test('logError logs via console.error', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    logError('some error occurred');

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('some error occurred'));
  });

  test('logWarn logs via console.info', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    logWarn('something happened');

    expect(consoleWarnSpy).toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('something happened'));
  });

  test('logInfo logs via console.info', () => {
    const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => undefined);

    logInfo('something happened');

    expect(consoleInfoSpy).toHaveBeenCalled();
    expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringContaining('something happened'));
  });
});
