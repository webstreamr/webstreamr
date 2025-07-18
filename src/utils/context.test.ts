import { Request } from 'express';
import { contextFromRequest } from './context';

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

    expect(contextFromRequest(req as unknown as Request)).toMatchSnapshot();
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

    expect(contextFromRequest(req as unknown as Request)).toMatchSnapshot();
  });
});
