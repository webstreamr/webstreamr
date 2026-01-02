import winston from 'winston';
import { createTestContext } from '../test';
import { FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { FileLions } from './FileLions';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new FileLions(new FetcherMock(`${__dirname}/__fixtures__/FileLions`))]);

const ctx = createTestContext({ mediaFlowProxyUrl: 'https://mediaflow.test.org', mediaFlowProxyPassword: 'test' });

describe('FileLions', () => {
  test('filelions f', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://filelions.to/f/tyn45apubte2'))).toMatchSnapshot();
  });

  test('mivalyo v referer lock', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://mivalyo.com/v/tah5znapz3e5'), { referer: 'https://kinoger.com' })).toMatchSnapshot();
  });

  test('file not found', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://filelions.to/v/ylcp2cu5qanb'))).toMatchSnapshot();
  });

  test('deleted by administration', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://callistanise.com/f/cy4t5nkerjrt'))).toMatchSnapshot();
  });
});
