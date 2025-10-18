import { MockAgent, setGlobalDispatcher } from 'undici';
import winston from 'winston';
import { createTestContext } from '../test';
import { Fetcher, FetcherMock } from '../utils';
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

  test('rate limit issues are retried and fail if no tlds are left', async () => {
    const mockAgent = new MockAgent({ enableCallHistory: true });
    mockAgent.disableNetConnect();
    setGlobalDispatcher(mockAgent);

    mockAgent.get('https://vidsrc-embed.ru')
      .intercept({ path: '/embed/movie/fake1' }).reply(429);
    mockAgent.get('https://vidsrc-embed.su')
      .intercept({ path: '/embed/movie/fake1' }).reply(429);

    const fetcher = new Fetcher(winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] }));
    const vidSrc = new VidSrc(fetcher, ['vidsrc-embed.ru', 'vidsrc-embed.su']);

    expect(await vidSrc.extract(ctx, new URL('https://vidsrc-embed.ru/embed/movie/fake1'), {})).toMatchSnapshot();
  });

  test('blocking issues are retried and fail if no tlds are left', async () => {
    const mockAgent = new MockAgent({ enableCallHistory: true });
    mockAgent.disableNetConnect();
    setGlobalDispatcher(mockAgent);

    mockAgent.get('https://vidsrc-embed.ru')
      .intercept({ path: '/embed/movie/fake2' }).reply(403);
    mockAgent.get('https://vidsrc-embed.su')
      .intercept({ path: '/embed/movie/fake2' }).reply(403);

    const fetcher = new Fetcher(winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] }));
    const vidSrc = new VidSrc(fetcher, ['vidsrc-embed.ru', 'vidsrc-embed.su']);

    expect(await vidSrc.extract(ctx, new URL('https://vidsrc-embed.ru/embed/movie/fake2'), {})).toMatchSnapshot();
  });
});
