import winston from 'winston';
import { createTestContext } from '../test';
import { FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { VidSrc } from './VidSrc';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new VidSrc(new FetcherMock(`${__dirname}/__fixtures__/VidSrc`), ['vidsrc-embed.ru'])]);

const ctx = createTestContext();

describe('VidSrc', () => {
  test('Full Metal Jacket', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://vidsrc-embed.ru/embed/movie/tt0093058'))).toMatchSnapshot();
  });

  test('Black Mirror', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://vidsrc-embed.ru/embed/tv/tt2085059/4-2'))).toMatchSnapshot();
  });
});
