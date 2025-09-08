import winston from 'winston';
import { createTestContext } from '../test';
import { FetcherMock } from '../utils';
import { ExtractorRegistry } from './ExtractorRegistry';
import { HubCloud } from './HubCloud';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
const extractorRegistry = new ExtractorRegistry(logger, [new HubCloud(new FetcherMock(`${__dirname}/__fixtures__/HubCloud`))]);

const ctx = createTestContext();

describe('HubCloud', () => {
  test('handle dexter original sin 2024 s01e01', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://hubcloud.one/drive/idt1evqfuviqiei'))).toMatchSnapshot();
  });

  test('handle crayon shin-chan 1993', async () => {
    expect(await extractorRegistry.handle(ctx, new URL('https://hubcloud.one/drive/bffzqlpqfllfcld'))).toMatchSnapshot();
  });
});
