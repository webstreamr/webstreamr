import { Extractor } from './types';
import { DoodStream } from './DoodStream';
import { Dropload } from './Dropload';
import { Fsst } from './Fsst';
import { SuperVideo } from './SuperVideo';
import { KinoGer } from './KinoGer';
import { Soaper } from './Soaper';
import { VidSrc } from './VidSrc';
import { ExternalUrl } from './ExternalUrl';
import { Fetcher } from '../utils';

export * from './ExtractorRegistry';
export * from './types';

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
