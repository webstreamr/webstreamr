import * as os from 'node:os';
import { Request } from 'express';

export const envGet = (name: string): string | undefined => process.env[name];

export const envGetRequired = (name: string): string => {
  const value = envGet(name);
  if (!value) {
    throw new Error(`Environment variable "${name}" is not configured.`);
  }

  return value;
};

export const envGetAppId = (): string => process.env['MANIFEST_ID'] || 'webstreamr';

export const envGetAppName = (): string => process.env['MANIFEST_NAME'] || 'WebStreamr';

export const envIsProd = (): boolean => process.env['NODE_ENV'] === 'production';

export const isElfHostedInstance = (req: Request): boolean => req.host.endsWith('elfhosted.com');

export const getCacheDir = (): string => envGet('CACHE_DIR') ?? os.tmpdir();
