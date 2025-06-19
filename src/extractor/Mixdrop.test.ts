import winston from 'winston';
import { FetcherMock } from '../utils';
import { CountryCode } from '../types';
import { ExtractorRegistry } from './ExtractorRegistry';
import { Mixdrop } from './Mixdrop';
import { createTestContext } from '../test';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new Mixdrop(new FetcherMock(`${__dirname}/__fixtures__/Mixdrop`))]);

const ctx = createTestContext({ mediaFlowProxyUrl: 'https://mediaflow-proxy.test', mediaFlowProxyPassword: 'asdfg' });

describe('Mixdrop', () => {
  test('mixdrop.my /e/', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://mixdrop.my/e/knq0kj8waq44l8'), CountryCode.de)).toMatchSnapshot();
  });

  test('deleted or expired file', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://mixdrop.ag/e/123456789'), CountryCode.de)).toMatchSnapshot();
  });
});
