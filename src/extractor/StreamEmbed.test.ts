import winston from 'winston';
import { createTestContext } from '../test';
import { CountryCode } from '../types';
import { FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { StreamEmbed } from './StreamEmbed';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new StreamEmbed(new FetcherMock(`${__dirname}/__fixtures__/StreamEmbed`))]);

const ctx = createTestContext();

describe('StreamEmbed', () => {
  test('watch.gxplayer.xyz', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://watch.gxplayer.xyz/watch?v=MEKI92PU'), CountryCode.de)).toMatchSnapshot();
  });
});
