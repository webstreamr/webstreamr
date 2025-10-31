import winston from 'winston';
import { createTestContext } from '../test';
import { FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { Vidora } from './Vidora';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new Vidora(new FetcherMock(`${__dirname}/__fixtures__/Vidora`))]);

const ctx = createTestContext();

describe('Vidora', () => {
  test('vidora.stream', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://vidora.stream/5iz6c1elaqgq'))).toMatchSnapshot();
  });

  test('vidora.stream /embed/', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://vidora.stream/embed/5iz6c1elaqgq'))).toMatchSnapshot();
  });
});
