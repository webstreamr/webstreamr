import winston from 'winston';
import { createTestContext } from '../test';
import { FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { VixSrc } from './VixSrc';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new VixSrc(new FetcherMock(`${__dirname}/__fixtures__/VixSrc`))]);

const ctx = createTestContext({ de: 'on', en: 'on', it: 'on' });

describe('VixSrc', () => {
  test('Full Metal Jacket', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://vixsrc.to/movie/600'))).toMatchSnapshot();
  });

  test('Black Mirror', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://vixsrc.to/tv/42009/4/2'))).toMatchSnapshot();
  });

  test('Black Mirror is excluded if no matching language was found', async () => {
    const ctx = createTestContext({ de: 'on' });

    expect(await extractorRegistry.handle(ctx, new URL('https://vixsrc.to/tv/42009/4/2'))).toMatchSnapshot();
  });
});
