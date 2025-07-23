import { Request } from 'express';
import { envGet, envGetAppId, envGetAppName, envIsProd, isElfHostedInstance, isHaydukInstance } from './env';

describe('env', () => {
  test('envGet', () => {
    expect(envGet('NODE_ENV')).toBe('test');
  });

  test('envGetAppId', () => {
    expect(envGetAppId()).toBe('webstreamr');

    process.env['MANIFEST_ID'] = 'webstreamr.dev';
    expect(envGetAppId()).toBe('webstreamr.dev');
    delete process.env['MANIFEST_ID'];
  });

  test('envGetAppName', () => {
    expect(envGetAppName()).toBe('WebStreamr');

    process.env['MANIFEST_NAME'] = 'WebStreamr | dev';
    expect(envGetAppName()).toBe('WebStreamr | dev');
    delete process.env['MANIFEST_NAME'];
  });

  test('envIsProd', () => {
    expect(envIsProd()).toBeFalsy();

    const previousNodeEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'production';
    expect(envIsProd()).toBeTruthy();
    process.env['NODE_ENV'] = previousNodeEnv;
  });

  test('isElfHostedInstancce', () => {
    expect(isElfHostedInstance({ host: 'someuser.elfhosted.com' } as Request)).toBeTruthy();
    expect(isElfHostedInstance({ host: 'webstreamr.hayd.uk' } as Request)).toBeFalsy();
  });

  test('isHaydukInstance', () => {
    expect(isHaydukInstance({ host: 'webstreamr.hayd.uk' } as Request)).toBeTruthy();
    expect(isHaydukInstance({ host: 'someuser.elfhosted.com' } as Request)).toBeFalsy();
  });
});
