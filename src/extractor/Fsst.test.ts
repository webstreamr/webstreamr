import winston from 'winston';
import { Fetcher } from '../utils';
import { Context, CountryCode } from '../types';
import { ExtractorRegistry } from './ExtractorRegistry';
import { Fsst } from './Fsst';

jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const fetcher = new Fetcher(logger);
const extractorRegistry = new ExtractorRegistry(logger, [new Fsst(fetcher)]);

const ctx: Context = { id: 'id', ip: '127.0.0.1', config: {} };

describe('Fsst', () => {
  test('Blood & Sinners', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://fsst.online/embed/900576/'), CountryCode.de)).toMatchSnapshot();
  });

  test('Dead City', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://fsst.online/embed/901994/'), CountryCode.de)).toMatchSnapshot();
  });
});
