import winston from 'winston';
import { createTestContext } from '../test';
import { FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { KinoGer } from './KinoGer';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new KinoGer(new FetcherMock(`${__dirname}/__fixtures__/KinoGer`))]);

const ctx = createTestContext();

describe('KinoGer', () => {
  test('Blood & Sinners', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://kinoger.re/#ge5fhb'))).toMatchSnapshot();
  });

  test('Dead City', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://kinoger.re/#x6tsx9'))).toMatchSnapshot();
  });

  test('filma365.strp2p.site', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://filma365.strp2p.site/#vih6bx'))).toMatchSnapshot();
  });
});
