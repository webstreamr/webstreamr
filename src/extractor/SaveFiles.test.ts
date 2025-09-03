import winston from 'winston';
import { createTestContext } from '../test';
import { FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { SaveFiles } from './SaveFiles';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new SaveFiles(new FetcherMock(`${__dirname}/__fixtures__/SaveFiles`))]);

const ctx = createTestContext();

describe('SafeFiles', () => {
  test('savefiles', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://savefiles.com/ip0k0dj2g0i3'))).toMatchSnapshot();
  });

  test('savefiles /e/', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://savefiles.com/e/edptfmhyjr39'))).toMatchSnapshot();
  });

  test('savefiles /d/', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://savefiles.com/d/s9g6zb5kjbqd'))).toMatchSnapshot();
  });

  test('savefiles locked file', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://savefiles.com/omqq55i59nvv'))).toMatchSnapshot();
  });

  test('streamhls /e/', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://streamhls.to/e/ip0k0dj2g0i3'))).toMatchSnapshot();
  });
});
