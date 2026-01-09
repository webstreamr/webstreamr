import winston from 'winston';
import { createTestContext } from '../test';
import { FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { StreamUp } from './StreamUp';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new StreamUp(new FetcherMock(`${__dirname}/__fixtures__/StreamUp`))]);

const ctx = createTestContext();

describe('StreamUp', () => {
  test('handle one battle after another', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://strmup.to/6950ae79eaa4c'))).toMatchSnapshot();
  });
});
