import winston from 'winston';
import { createTestContext } from '../test';
import { CountryCode } from '../types';
import { FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { SaveFiles } from './SaveFiles';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new SaveFiles(new FetcherMock(`${__dirname}/__fixtures__/SaveFiles`))]);

const ctx = createTestContext();

describe('SafeFiles', () => {
  test('savefiles', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://savefiles.com/ip0k0dj2g0i3'), CountryCode.en)).toMatchSnapshot();
  });

  test('savefiles locked file', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://savefiles.com/omqq55i59nvv'), CountryCode.en)).toMatchSnapshot();
  });

  test('streamhls /e/', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://streamhls.to/e/ip0k0dj2g0i3'), CountryCode.en)).toMatchSnapshot();
  });
});
