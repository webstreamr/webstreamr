import { Request } from 'express';
import { Context } from '../types';
import { getDefaultConfig } from './config';

export const contextFromRequest = (req: Request): Context => {
  return {
    hostUrl: new URL(`${req.protocol}://${req.host}`),
    id: req.headers['X-Request-ID'] as string,
    ...(req.ip && { ip: req.ip }),
    config: req.params['config'] ? JSON.parse(req.params['config']) : getDefaultConfig(),
  };
};
