import addon from './addon';

describe('addon', () => {
  test('manifest can be retrieved with defaults', () => {
    expect(addon.manifest).toStrictEqual(
      expect.objectContaining({
        id: 'webstreamr',
        name: 'WebStreamr',
        description: 'Provides HTTP URLs from streaming websites.',
      }),
    );
  });
});
