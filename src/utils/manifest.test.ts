import { DoodStream } from '../extractor/DoodStream';
import { ExternalUrl } from '../extractor/ExternalUrl';
import { SuperVideo } from '../extractor/SuperVideo';
import { createSources } from '../source';
import { MeineCloud } from '../source/MeineCloud';
import { StreamKiste } from '../source/StreamKiste';
import { VerHdLink } from '../source/VerHdLink';
import { VixSrc } from '../source/VixSrc';
import { FetcherMock } from './FetcherMock';
import { buildManifest } from './manifest';

const fetcher = new FetcherMock('/dev/null');

describe('buildManifest', () => {
  test('default manifest', async () => {
    const manifest = buildManifest(createSources(fetcher), [], {});

    expect(manifest).toMatchSnapshot({
      version: expect.any(String),
    });
  });

  test('has unchecked source without a config', () => {
    const sources = [
      new VixSrc(fetcher),
      new VerHdLink(fetcher),
      new StreamKiste(fetcher),
      new MeineCloud(fetcher),
    ];

    const manifest = buildManifest(sources, [], {});

    expect(manifest.config).toMatchSnapshot();
  });

  test('has checked source with appropriate config', () => {
    const sources = [
      new VerHdLink(fetcher),
      new StreamKiste(fetcher),
      new MeineCloud(fetcher),
    ];
    const manifest = buildManifest(sources, [], { de: 'on', includeExternalUrls: 'on' });

    expect(manifest.config).toMatchSnapshot();
  });

  test('showErrors and includeExternalUrls are unchecked by default', () => {
    const manifest = buildManifest([], [], {});

    expect(manifest.config).toMatchSnapshot();
  });

  test('has checked showErrors', () => {
    const manifest = buildManifest([], [], { showErrors: 'on' });

    expect(manifest.config).toMatchSnapshot();
  });

  test('has checked includeExternalUrls', () => {
    const manifest = buildManifest([], [], { includeExternalUrls: 'on' });

    expect(manifest.config).toMatchSnapshot();
  });

  test('has checked noCache', () => {
    const manifest = buildManifest([], [], { noCache: 'on' });

    expect(manifest.config).toMatchSnapshot();
  });

  test('disable extractors', () => {
    const extractors = [
      new DoodStream(fetcher),
      new SuperVideo(fetcher),
      new ExternalUrl(fetcher),
    ];
    const manifest = buildManifest([], extractors, { disableExtractor_doodstream: 'on' });

    expect(manifest.config).toMatchSnapshot();
  });
});
