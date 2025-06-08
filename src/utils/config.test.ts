import { getDefaultConfig } from './config';

describe('getDefaultConfig', () => {
  test('has English enabled', () => {
    expect(getDefaultConfig().en).toBe('on');
  });
});
