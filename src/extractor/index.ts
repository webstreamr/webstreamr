import { Fetcher } from '../utils';
import { DoodStream } from './DoodStream';
import { Dropload } from './Dropload';
import { ExternalUrl } from './ExternalUrl';
import { Extractor } from './Extractor';
import { Fastream } from './Fastream';
import { KinoGer } from './KinoGer';
import { Mixdrop } from './Mixdrop';
import { Soaper } from './Soaper';
import { StreamEmbed } from './StreamEmbed';
import { Streamtape } from './Streamtape';
import { SuperVideo } from './SuperVideo';
import { Uqload } from './Uqload';
import { VidSrc } from './VidSrc';
import { VixSrc } from './VixSrc';

export * from './Extractor';
export * from './ExtractorRegistry';

export const createExtractors = (fetcher: Fetcher): Extractor[] => [
  new DoodStream(fetcher),
  new Dropload(fetcher),
  new Fastream(fetcher),
  new KinoGer(fetcher),
  new Mixdrop(fetcher),
  new Soaper(fetcher),
  new StreamEmbed(fetcher),
  new Streamtape(fetcher),
  new SuperVideo(fetcher),
  new Uqload(fetcher),
  new VidSrc(fetcher),
  new VixSrc(fetcher),
  new ExternalUrl(fetcher), // fallback extractor which must come last
];
