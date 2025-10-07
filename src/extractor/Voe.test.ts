import winston from 'winston';
import { createTestContext } from '../test';
import { FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { Voe } from './Voe';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new Voe(new FetcherMock(`${__dirname}/__fixtures__/Voe`))]);

const ctx = createTestContext({ mediaFlowProxyUrl: 'https://mediaflow.test.org', mediaFlowProxyPassword: 'test' });

describe('Voe', () => {
  test('jilliandescribecompany', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://jilliandescribecompany.com/e/ea21l02gcygw'))).toMatchSnapshot();
  });

  test('premium only without resolution', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://jilliandescribecompany.com/qqfyi04w52mj'))).toMatchSnapshot();
  });

  test('encoding error', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://voe.sx/e/c2yxvit4f6bz'))).toMatchSnapshot();
  });
});
