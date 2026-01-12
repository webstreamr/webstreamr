import { Request, Response } from 'express';
import { Context } from '../types';
import { getDefaultConfig } from './config';

export const contextFromRequestAndResponse = (req: Request, res: Response): Context => {
  return {
    hostUrl: new URL(`${req.protocol}://${req.host}`),
    id: res.getHeader('X-Request-ID') as string,
    ...(req.ip && { ip: req.ip }),
    config: req.params['config'] ? JSON.parse(req.params['config'] as string) : getDefaultConfig(),
  };
};
