import { Config, Context } from '../types';
import { getDefaultConfig } from '../utils';

export const createTestContext = (config?: Config): Context => {
  return {
    hostUrl: new URL('http://localhost'),
    id: 'test',
    config: config ?? getDefaultConfig(),
  };
};
