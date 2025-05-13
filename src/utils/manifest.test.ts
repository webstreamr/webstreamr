import winston from 'winston';
import { buildManifest } from './manifest';
import { KinoKiste } from '../handler';
import { Fetcher } from './Fetcher';
import { EmbedExtractorRegistry } from '../embed-extractor';

const logger = winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] });
// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();

describe('buildManifest', () => {
  test('has an empty config without handlers', () => {
    const manifest = buildManifest([], {});

    expect(manifest.config).toStrictEqual([]);
  });

  test('has unchecked handler without a config', () => {
    const manifest = buildManifest([new KinoKiste(fetcher, new EmbedExtractorRegistry(logger, fetcher))], {});

    expect(manifest.config).toHaveLength(1);
    expect(manifest.config[0]?.default).toBeUndefined();
  });

  test('has checked handler with appropriate config', () => {
    const kinokiste = new KinoKiste(fetcher, new EmbedExtractorRegistry(logger, fetcher));
    const manifest = buildManifest([kinokiste], { [kinokiste.id]: 'on' });

    expect(manifest.config).toHaveLength(1);
    expect(manifest.config[0]?.default).toBe('checked');
  });
});
