import winston from 'winston';
import { createTestContext } from '../test';
import { CountryCode } from '../types';
import { FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { Soaper } from './Soaper';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new Soaper(new FetcherMock(`${__dirname}/__fixtures__/Soaper`))]);

const ctx = createTestContext();

describe('Soaper', () => {
  test('Full Metal Jacket', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://soaper.live/movie_d8kdeypDY9.html'), CountryCode.en, 'Full Metal Jacket (1987)')).toMatchSnapshot();
  });

  test('Black Mirror', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://soaper.live/episode_5KDq78eGp1.html'), CountryCode.en, 'Black Mirror 4x2')).toMatchSnapshot();
  });

  test('last of us s2e3', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://soaper.live/episode_rYg3vMEDL1.html'), CountryCode.de, 'The Last of Us 2x3')).toMatchSnapshot();
  });
});
