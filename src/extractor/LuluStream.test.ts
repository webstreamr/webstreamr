import winston from 'winston';
import { createTestContext } from '../test';
import { FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { LuluStream } from './LuluStream';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new LuluStream(new FetcherMock(`${__dirname}/__fixtures__/LuluStream`))]);

const ctx = createTestContext({ mediaFlowProxyUrl: 'https://mediaflow.test.org', mediaFlowProxyPassword: 'test' });

describe('LuluStream', () => {
  test('streamhihi d', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://streamhihi.com/d/mk9m58lz8ts6'))).toMatchSnapshot();
  });

  test('no such file', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://lulustream.com/e/uthq0o0sljnx'))).toMatchSnapshot();
  });
});
