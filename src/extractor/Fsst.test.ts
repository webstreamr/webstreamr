import winston from 'winston';
import { createTestContext } from '../test';
import { FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { Fsst } from './Fsst';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new Fsst(new FetcherMock(`${__dirname}/__fixtures__/Fsst`))]);

const ctx = createTestContext();

describe('Fsst', () => {
  test('Wake up Dead Man', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://fsst.online/embed/948429/'))).toMatchSnapshot();
  });
});
