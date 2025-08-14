import { MockAgent, setGlobalDispatcher } from 'undici';
import winston from 'winston';
import { createTestContext } from '../test';
import { CountryCode } from '../types';
import { Fetcher, FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { VidSrc } from './VidSrc';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new VidSrc(new FetcherMock(`${__dirname}/__fixtures__/VidSrc`), ['xyz'])]);

const ctx = createTestContext();

describe('VidSrc', () => {
  test('Full Metal Jacket', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://vidsrc.xyz/embed/movie/tt0093058'), CountryCode.en, 'Full Metal Jacket (1987)')).toMatchSnapshot();
  });

  test('Black Mirror', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://vidsrc.xyz/embed/tv/tt2085059/4/2'), CountryCode.en, 'Black Mirror 4x2')).toMatchSnapshot();
  });

  test('not found', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://vidsrc.xyz/embed/movie/tt35628853'), CountryCode.en, 'Titan: The OceanGate Disaster')).toMatchSnapshot();
  });

  test('rate limit issues are retried and fail if no tlds are left', async () => {
    const mockAgent = new MockAgent({ enableCallHistory: true });
    mockAgent.disableNetConnect();
    setGlobalDispatcher(mockAgent);

    mockAgent.get('https://vidsrc.xyz')
      .intercept({ path: '/embed/movie/tt33043892/1/1' }).reply(429);
    mockAgent.get('https://vidsrc.net')
      .intercept({ path: '/embed/movie/tt33043892/1/1' }).reply(429);

    const fetcher = new Fetcher(winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] }));
    const vidSrc = new VidSrc(fetcher, ['net', 'xyz']);

    expect(await vidSrc.extract(ctx, new URL('https://vidsrc.xyz/embed/movie/tt33043892/1/1'), CountryCode.en, 'Dexter: Resurrection 1x1')).toMatchSnapshot();
  });
});
