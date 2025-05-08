#!/usr/bin/env node
import { serveHTTP } from 'stremio-addon-sdk';
import addonInterface from './addon';

serveHTTP(addonInterface, {
  cacheMaxAge: process.env['NODE_ENV'] === 'production' ? 3600 : undefined,
  port: parseInt(process.env['PORT'] || '51546'),
});
