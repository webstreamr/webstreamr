import winston from 'winston';
import { FetcherMock } from '../utils';
import { CountryCode } from '../types';
import { ExtractorRegistry } from './ExtractorRegistry';
import { ExternalUrl } from './ExternalUrl';
import { createTestContext } from '../test';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new ExternalUrl(new FetcherMock(`${__dirname}/__fixtures__/ExternalUrl`))]);

const ctx = createTestContext({ includeExternalUrls: 'on' });

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
