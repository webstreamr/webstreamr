import { Config, Context } from '../types';
import { getDefaultConfig } from '../utils';

export const createTestContext = (config?: Config): Context => {
  return {
    id: 'test',
    config: config ?? getDefaultConfig(),
  };
};
