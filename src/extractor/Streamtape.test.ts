import winston from 'winston';
import { FetcherMock } from '../utils';
import { CountryCode } from '../types';
import { ExtractorRegistry } from './ExtractorRegistry';
import { Streamtape } from './Streamtape';
import { createTestContext } from '../test';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new Streamtape(new FetcherMock(`${__dirname}/__fixtures__/Streamtape`))]);

const ctx = createTestContext({ mediaFlowProxyUrl: 'https://mediaflow-proxy.test', mediaFlowProxyPassword: 'asdfg' });

describe('Streamtape', () => {
  test('streamtape.com /e', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://streamtape.com/e/84Kb3mkoYAiokmW'), CountryCode.es)).toMatchSnapshot();
  });
});
