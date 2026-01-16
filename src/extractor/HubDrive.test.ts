import winston from 'winston';
import { createTestContext } from '../test';
import { FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { HubCloud } from './HubCloud';
import { HubDrive } from './HubDrive';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(
  logger,
  [
    new HubDrive(
      new FetcherMock(`${__dirname}/__fixtures__/HubDrive`),
      new HubCloud(new FetcherMock(`${__dirname}/__fixtures__/HubDrive/HubCloud`)),
    ),
  ],
);

const ctx = createTestContext();

describe('HubDrive', () => {
  test('handle avatar', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://hubdrive.space/file/7283903021'))).toMatchSnapshot();
  });
});
