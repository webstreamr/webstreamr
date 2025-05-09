import { buildManifest } from './manifest';
import { KinoKiste } from '../handler';

describe('buildManifest', () => {
  test('has an empty config without handlers', () => {
    const manifest = buildManifest([], {});

    expect(manifest.config).toStrictEqual([]);
  });

  test('has unchecked handler without a config', () => {
    const manifest = buildManifest([new KinoKiste()], {});

    expect(manifest.config).toHaveLength(1);
    expect(manifest.config[0]?.default).toBeUndefined();
  });

  test('has checked handler with appropriate config', () => {
    const kinokiste = new KinoKiste();
    const manifest = buildManifest([kinokiste], { [kinokiste.id]: 'on' });

    expect(manifest.config).toHaveLength(1);
    expect(manifest.config[0]?.default).toBe('checked');
  });
});
