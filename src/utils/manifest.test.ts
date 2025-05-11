import { buildManifest } from './manifest';
import { KinoKiste } from '../handler';
import { Fetcher } from './Fetcher';
import { EmbedExtractors } from '../embed-extractor';

// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();

describe('buildManifest', () => {
  test('has an empty config without handlers', () => {
    const manifest = buildManifest([], {});

    expect(manifest.config).toStrictEqual([]);
  });

  test('has unchecked handler without a config', () => {
    const manifest = buildManifest([new KinoKiste(fetcher, new EmbedExtractors([]))], {});

    expect(manifest.config).toHaveLength(1);
    expect(manifest.config[0]?.default).toBeUndefined();
  });

  test('has checked handler with appropriate config', () => {
    const kinokiste = new KinoKiste(fetcher, new EmbedExtractors([]));
    const manifest = buildManifest([kinokiste], { [kinokiste.id]: 'on' });

    expect(manifest.config).toHaveLength(1);
    expect(manifest.config[0]?.default).toBe('checked');
  });
});
