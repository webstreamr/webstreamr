import winston from 'winston';
import { buildManifest } from './manifest';
import { KinoKiste, MeineCloud, VerHdLink } from '../handler';
import { Fetcher } from './Fetcher';
import { ExtractorRegistry } from '../extractor';
jest.mock('../utils/Fetcher');

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();

describe('buildManifest', () => {
  test('has unchecked handler without a config', () => {
    const extractorRegistry = new ExtractorRegistry(logger, fetcher);
    const handlers = [
      new VerHdLink(fetcher, extractorRegistry),
      new KinoKiste(fetcher, extractorRegistry),
      new MeineCloud(fetcher, extractorRegistry),
    ];

    const manifest = buildManifest(handlers, {});

    expect(manifest.config).toMatchSnapshot();
  });

  test('has checked handler with appropriate config', () => {
    const extractorRegistry = new ExtractorRegistry(logger, fetcher);
    const handlers = [
      new VerHdLink(fetcher, extractorRegistry),
      new KinoKiste(fetcher, extractorRegistry),
      new MeineCloud(fetcher, extractorRegistry),
    ];
    const manifest = buildManifest(handlers, { de: 'on' });

    expect(manifest.config).toMatchSnapshot();
  });
});
