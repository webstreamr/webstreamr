import winston from 'winston';
import { createTestContext } from '../test';
import { FetcherMock } from '../utils';
import { Dropload } from './Dropload';
import { ExtractorRegistry } from './ExtractorRegistry';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new Dropload(new FetcherMock(`${__dirname}/__fixtures__/Dropload`))]);

const ctx = createTestContext();

describe('Dropload', () => {
  test('dropload.io', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://dropload.io/embed-lyo2h1snpe5c.html'))).toMatchSnapshot();
  });

  test('file not found', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://dropload.io/asdfghijklmn.html'))).toMatchSnapshot();
  });

  test('processing / internal problem', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://dropload.io/7xtxuac84xyh.html'))).toMatchSnapshot();
  });

  test('download URL', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://dropload.io/d/xhcmgcc2txnv'))).toMatchSnapshot();
  });
});
