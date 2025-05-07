import addon from './addon';

describe('addon', () => {
  test('manifest can be retrieved', () => {
    expect(addon.manifest).toStrictEqual(
      expect.objectContaining({
        id: 'community.webstreamr',
      }),
    );
  });
});
