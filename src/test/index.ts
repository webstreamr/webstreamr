import { Config, Context } from '../types';
import { getDefaultConfig } from '../utils';

export const createTestContext = (config?: Config): Context => {
  return {
    id: 'test',
    ip: '0.0.0.0',
    config: config ?? getDefaultConfig(),
  };
};
