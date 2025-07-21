import { MeineCloud } from '../source/MeineCloud';
import { StreamKiste } from '../source/StreamKiste';
import { VerHdLink } from '../source/VerHdLink';
import { VixSrc } from '../source/VixSrc';
import { FetcherMock } from './FetcherMock';
import { buildManifest } from './manifest';

const fetcher = new FetcherMock('/dev/null');

describe('buildManifest', () => {
  test('has unchecked source without a config', () => {
    const sources = [
      new VixSrc(fetcher),
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
    const manifest = buildManifest(sources, { de: 'on', includeExternalUrls: 'on' });

    expect(manifest.config).toMatchSnapshot();
  });

  test('includeExternalUrls is unchecked by default', () => {
    const manifest = buildManifest([], {});

    expect(manifest.config).toMatchSnapshot();
  });

  test('has checked includeExternalUrls', () => {
    const manifest = buildManifest([], { includeExternalUrls: 'on' });

    expect(manifest.config).toMatchSnapshot();
  });
});
