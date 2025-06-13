import { DoodStream } from './DoodStream';
import { Dropload } from './Dropload';
import { ExternalUrl } from './ExternalUrl';
import { Extractor } from './Extractor';
import { Fsst } from './Fsst';
import { KinoGer } from './KinoGer';
import { Soaper } from './Soaper';
import { SuperVideo } from './SuperVideo';
import { VidSrc } from './VidSrc';
import { Fetcher } from '../utils';

export * from './Extractor';
export * from './ExtractorRegistry';

export const createExtractors = (fetcher: Fetcher): Extractor[] => [
  new DoodStream(fetcher),
  new Dropload(fetcher),
  new Fsst(fetcher),
  new SuperVideo(fetcher),
  new KinoGer(fetcher),
  new Soaper(fetcher),
  new VidSrc(fetcher),
  new ExternalUrl(fetcher), // fallback extractor which must come last
];
