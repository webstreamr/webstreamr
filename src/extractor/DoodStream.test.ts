import winston from 'winston';
import { Fetcher } from '../utils';
import { Context, CountryCode } from '../types';
import { ExtractorRegistry } from './ExtractorRegistry';
import { DoodStream } from './DoodStream';

jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();
const extractorRegistry = new ExtractorRegistry(logger, [new DoodStream(fetcher)]);

const ctx: Context = { id: 'id', ip: '127.0.0.1', config: {} };

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
