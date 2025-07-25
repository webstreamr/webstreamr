import winston from 'winston';
import { createTestContext } from '../test';
import { CountryCode } from '../types';
import { FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { Fastream } from './Fastream';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new Fastream(new FetcherMock(`${__dirname}/__fixtures__/Fastream`))]);

const ctx = createTestContext({ mediaFlowProxyUrl: 'https://mediaflow-proxy.test', mediaFlowProxyPassword: 'asdfg' });

describe('Fastream', () => {
  test('fastream.to embed', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://fastream.to/embed-3aooif4ozt10.html'), CountryCode.es)).toMatchSnapshot();
  });
});
