#!/usr/bin/env node
import { serveHTTP } from 'stremio-addon-sdk';
import addonInterface from './addon';

serveHTTP(addonInterface, { port: parseInt(process.env['PORT'] || '51546'), cacheMaxAge: 3600 });
