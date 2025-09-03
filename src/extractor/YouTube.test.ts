import winston from 'winston';
import { createTestContext } from '../test';
import { FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { YouTube } from './YouTube';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new YouTube(new FetcherMock(`${__dirname}/__fixtures__/YouTube`))]);

const ctx = createTestContext();

describe('YouTube', () => {
  test('Solaris', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://www.youtube.com/watch?v=Z8ZhQPaw4rE'))).toMatchSnapshot();
  });

  test('unsupported format', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://youtu.be/Z8ZhQPaw4rE?feature=shared'))).toMatchSnapshot();
  });
});
