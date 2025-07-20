import { Request, Response } from 'express';
import { contextFromRequestAndResponse } from './context';

describe('contextFromRequest', () => {
  test('with config and ip', () => {
    const req = {
      protocol: 'https',
      host: 'localhost',
      headers: {
        'X-Request-ID': 'fake-id',
      },
      ip: '127.0.0.1',
      params: { config: '{"de":"on"}' },
    };
    const res = {
      getHeader: (name: string) => ({ 'X-Request-ID': 'fake-id' })[name],
    };

    expect(contextFromRequestAndResponse(req as unknown as Request, res as unknown as Response)).toMatchSnapshot();
  });

  test('without config', () => {
    const req = {
      protocol: 'https',
      host: 'localhost',
      headers: {
        'X-Request-ID': 'fake-id',
      },
      params: { },
    };
    const res = {
      getHeader: (name: string) => ({ 'X-Request-ID': 'fake-id' })[name],
    };

    expect(contextFromRequestAndResponse(req as unknown as Request, res as unknown as Response)).toMatchSnapshot();
  });
});
