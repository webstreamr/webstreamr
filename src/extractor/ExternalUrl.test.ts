import winston from 'winston';
import { createTestContext } from '../test';
import { FetcherMock } from '../utils';
import { ExternalUrl } from './ExternalUrl';
import { ExtractorRegistry } from './ExtractorRegistry';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new ExternalUrl(new FetcherMock(`${__dirname}/__fixtures__/ExternalUrl`))]);

const ctx = createTestContext({ includeExternalUrls: 'on' });

describe('ExternalUrl', () => {
  test('404 - not found', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://streamtape.com/e/gjA1OQ4klyHxgJ'))).toMatchSnapshot();
  });

  test('netu.fanstream.us', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://netu.fanstream.us/e/0DFgfkcXOsDP'))).toMatchSnapshot();
  });
});
