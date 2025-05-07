import { fulfillAllPromises } from './promise';

describe('promise', () => {
  test('fulfillAllPromises returns all resolved promise values and logs rejected ones', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    const results = await fulfillAllPromises([
      Promise.resolve('ok'),
      Promise.reject('not ok'),
    ]);

    expect(results).toStrictEqual(['ok']);
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Could not fulfill promise: not ok'));
  });
});
