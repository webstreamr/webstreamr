import { envGet, Fetcher } from '../utils';
import { DoodStream } from './DoodStream';
import { Dropload } from './Dropload';
import { ExternalUrl } from './ExternalUrl';
import { Extractor } from './Extractor';
import { Fastream } from './Fastream';
import { FileLions } from './FileLions';
import { HubCloud } from './HubCloud';
import { KinoGer } from './KinoGer';
import { Mixdrop } from './Mixdrop';
import { SaveFiles } from './SaveFiles';
import { Soaper } from './Soaper';
import { StreamEmbed } from './StreamEmbed';
import { Streamtape } from './Streamtape';
import { SuperVideo } from './SuperVideo';
import { Uqload } from './Uqload';
import { VidSrc } from './VidSrc';
import { VixSrc } from './VixSrc';
import { XPrime } from './XPrime';
import { YouTube } from './YouTube';

export * from './Extractor';
export * from './ExtractorRegistry';

export const createExtractors = (fetcher: Fetcher): Extractor[] => {
  const disabledExtractors = envGet('DISABLED_EXTRACTORS')?.split(',') ?? [];

  return [
    new DoodStream(fetcher),
    new Dropload(fetcher),
    new Fastream(fetcher),
    new FileLions(fetcher),
    new HubCloud(fetcher),
    new KinoGer(fetcher),
    new Mixdrop(fetcher),
    new SaveFiles(fetcher),
    new Soaper(fetcher),
    new StreamEmbed(fetcher),
    new Streamtape(fetcher),
    new SuperVideo(fetcher),
    new Uqload(fetcher),
    new VidSrc(fetcher, ['in', 'net', 'xyz', 'io', 'vc']), // https://vidsrc.domains/
    new VixSrc(fetcher),
    new XPrime(fetcher),
    new YouTube(fetcher),
    new ExternalUrl(fetcher), // fallback extractor which must come last
  ].filter(extractor => !disabledExtractors.includes(extractor.id));
};
