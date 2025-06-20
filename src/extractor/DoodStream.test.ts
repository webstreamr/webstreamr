import winston from 'winston';
import { FetcherMock } from '../utils';
import { CountryCode } from '../types';
import { ExtractorRegistry } from './ExtractorRegistry';
import { DoodStream } from './DoodStream';
import { createTestContext } from '../test';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new DoodStream(new FetcherMock(`${__dirname}/__fixtures__/DoodStream`))]);

const ctx = createTestContext();

describe('DoodStream', () => {
  test('dood.to', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('http://dood.to/e/sk1m9eumzyjj'), CountryCode.de)).toMatchSnapshot();
  });

  test('doodster', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://dooodster.com/e/1cfcevn6dg8shrfvht22odxw2lty18hr'), CountryCode.de)).toMatchSnapshot();
  });

  test('missing pass_md5 -> not found', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://dood.to/e/gy8l8mb2i311'), CountryCode.mx)).toMatchSnapshot();
  });

  test('can guess height from title', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://do7go.com/e/dfx8me4un4ul'), CountryCode.fr)).toMatchSnapshot();
  });
});
