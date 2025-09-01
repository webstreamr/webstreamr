import winston from 'winston';
import { createTestContext } from '../test';
import { CountryCode } from '../types';
import { FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { VixSrc } from './VixSrc';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new VixSrc(new FetcherMock(`${__dirname}/__fixtures__/VixSrc`))]);

const ctx = createTestContext({ mediaFlowProxyUrl: 'https://mediaflow-proxy.test', mediaFlowProxyPassword: 'asdfg', de: 'on', en: 'on', it: 'on' });

describe('VixSrc', () => {
  test('Full Metal Jacket', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://vixsrc.to/movie/600'), CountryCode.it, 'Full Metal Jacket (1987)')).toMatchSnapshot();
  });

  test('Black Mirror', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://vixsrc.to/tv/42009/4/2'), CountryCode.it, 'Black Mirror 4x2')).toMatchSnapshot();
  });

  test('Black Mirror is excluded if no matching language was found', async () => {
    const ctx = createTestContext({ mediaFlowProxyUrl: 'https://mediaflow-proxy2.test', mediaFlowProxyPassword: 'asdfg', de: 'on' });

    expect(await extractorRegistry.handle(ctx, new URL('https://vixsrc.to/tv/42009/4/2'), CountryCode.it, 'Black Mirror 4x2')).toMatchSnapshot();
  });
});
