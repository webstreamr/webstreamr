import winston from 'winston';
import { createTestContext } from '../test';
import { FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { RgShows } from './RgShows';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new RgShows(new FetcherMock(`${__dirname}/__fixtures__/RgShows`))]);

const ctx = createTestContext();

describe('RgShows', () => {
  test('handle one battle after another', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://api.rgshows.ru/main/movie/1054867'))).toMatchSnapshot();
  });

  test('handle stranger things s05e01', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://api.rgshows.ru/main/tv/66732/5/1'))).toMatchSnapshot();
  });
});
