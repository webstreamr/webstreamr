import { buildManifest } from './manifest';
import { StreamKiste, MeineCloud, VerHdLink } from '../handler';
import { Fetcher } from './Fetcher';
jest.mock('../utils/Fetcher');

// @ts-expect-error No constructor args needed
const fetcher = new Fetcher();

describe('buildManifest', () => {
  test('has unchecked handler without a config', () => {
    const handlers = [
      new VerHdLink(fetcher),
      new StreamKiste(fetcher),
      new MeineCloud(fetcher),
    ];

    const manifest = buildManifest(handlers, {});

    expect(manifest.config).toMatchSnapshot();
  });

  test('has checked handler with appropriate config', () => {
    const handlers = [
      new VerHdLink(fetcher),
      new StreamKiste(fetcher),
      new MeineCloud(fetcher),
    ];
    const manifest = buildManifest(handlers, { de: 'on' });

    expect(manifest.config).toMatchSnapshot();
  });
});
