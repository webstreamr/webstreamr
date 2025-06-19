import winston from 'winston';
import { FetcherMock } from '../utils';
import { CountryCode } from '../types';
import { ExtractorRegistry } from './ExtractorRegistry';
import { SuperVideo } from './SuperVideo';
import { createTestContext } from '../test';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new SuperVideo(new FetcherMock(`${__dirname}/__fixtures__/SuperVideo`))]);

const ctx = createTestContext();

describe('SuperVideo', () => {
  test('supervideo.cc /e/', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://supervideo.cc/e/q7i0sw1oytw3'), CountryCode.de)).toMatchSnapshot();
  });

  test('supervideo.tv /embed-/', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://supervideo.tv/embed-1p0m1fi9mok8.html'), CountryCode.it)).toMatchSnapshot();
  });

  test('embed only', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://supervideo.cc/e/bj6szat1pval'), CountryCode.it)).toMatchSnapshot();
  });

  test('deleted or expired file', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://supervideo.cc/ndf5shmy9lpt'), CountryCode.it)).toMatchSnapshot();
  });
});
