import winston from 'winston';
import { Fetcher } from '../utils';
import { Context, CountryCode } from '../types';
import { ExtractorRegistry } from './ExtractorRegistry';
import { ExternalUrl } from './ExternalUrl';

jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const extractorRegistry = new ExtractorRegistry(logger, [new ExternalUrl(fetcher)]);

const ctx: Context = { id: 'id', ip: '127.0.0.1', config: {} };

describe('ExternalUrl', () => {
  test('404 - not found', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://streamtape.com/e/gjA1OQ4klyHxgJ'), CountryCode.fr)).toMatchSnapshot();
  });

  test('netu.fanstream.us', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://netu.fanstream.us/e/0DFgfkcXOsDP'), CountryCode.fr)).toMatchSnapshot();
  });

  test('johnalwayssame.com with title', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://johnalwayssame.com/e/cqy9oue7sv0g'), CountryCode.fr, 'Black Mirror 4x2')).toMatchSnapshot();
  });
});
