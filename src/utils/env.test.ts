import { envGet, envGetAppId, envGetAppName, envIsProd } from './env';

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
});
