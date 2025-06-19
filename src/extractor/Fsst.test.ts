import winston from 'winston';
import { FetcherMock } from '../utils';
import { CountryCode } from '../types';
import { ExtractorRegistry } from './ExtractorRegistry';
import { Fsst } from './Fsst';
import { createTestContext } from '../test';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new Fsst(new FetcherMock(`${__dirname}/__fixtures__/Fsst`))]);

const ctx = createTestContext();

describe('Fsst', () => {
  test('Blood & Sinners', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://fsst.online/embed/900576/'), CountryCode.de)).toMatchSnapshot();
  });

  test('Dead City', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://fsst.online/embed/901994/'), CountryCode.de)).toMatchSnapshot();
  });

  test('How to Train Your Dragon', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://fsst.online/embed/902668/'), CountryCode.de)).toMatchSnapshot();
  });
});
