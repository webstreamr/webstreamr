import { buildManifest } from './manifest';
import { StreamKiste, MeineCloud, VerHdLink } from '../source';
import { Fetcher } from './Fetcher';
jest.mock('../utils/Fetcher');

// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();

describe('buildManifest', () => {
  test('has unchecked source without a config', () => {
    const sources = [
      new VerHdLink(fetcher),
      new StreamKiste(fetcher),
      new MeineCloud(fetcher),
    ];

    const manifest = buildManifest(sources, {});

    expect(manifest.config).toMatchSnapshot();
  });

  test('has checked source with appropriate config', () => {
    const sources = [
      new VerHdLink(fetcher),
      new StreamKiste(fetcher),
      new MeineCloud(fetcher),
    ];
    const manifest = buildManifest(sources, { de: 'on' });

    expect(manifest.config).toMatchSnapshot();
  });
});
