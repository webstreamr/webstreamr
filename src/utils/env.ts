import { Request } from 'express';

export const envGet = (name: string): string | undefined => process.env[name];

export const envGetAppId = (): string => process.env['MANIFEST_ID'] || 'webstreamr';

export const envGetAppName = (): string => process.env['MANIFEST_NAME'] || 'WebStreamr';

export const envIsProd = (): boolean => process.env['NODE_ENV'] === 'production';

export const isElfHostedInstance = (req: Request): boolean => req.host.endsWith('elfhosted.com');

export const isHaydukInstance = (req: Request): boolean => req.host.endsWith('hayd.uk');
