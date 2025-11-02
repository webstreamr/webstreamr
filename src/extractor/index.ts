import { envGet, Fetcher } from '../utils';
import { DoodStream } from './DoodStream';
import { Dropload } from './Dropload';
import { ExternalUrl } from './ExternalUrl';
import { Extractor } from './Extractor';
import { Fastream } from './Fastream';
import { FileLions } from './FileLions';
import { FileMoon } from './FileMoon';
import { HubCloud } from './HubCloud';
import { KinoGer } from './KinoGer';
import { LuluStream } from './LuluStream';
import { Mixdrop } from './Mixdrop';
import { SaveFiles } from './SaveFiles';
import { StreamEmbed } from './StreamEmbed';
import { Streamtape } from './Streamtape';
import { SuperVideo } from './SuperVideo';
import { Uqload } from './Uqload';
import { Vidora } from './Vidora';
import { VidSrc } from './VidSrc';
import { VixSrc } from './VixSrc';
import { Voe } from './Voe';
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
    new FileMoon(fetcher),
    new HubCloud(fetcher),
    new KinoGer(fetcher),
    new LuluStream(fetcher),
    new Mixdrop(fetcher),
    new SaveFiles(fetcher),
    new StreamEmbed(fetcher),
    new Streamtape(fetcher),
    new SuperVideo(fetcher),
    new Uqload(fetcher),
    new Vidora(fetcher),
    new VidSrc(fetcher, [ // https://vidsrc.domains/
      'vidsrcme.ru',
      'vidsrcme.su',
      'vidsrc-me.ru',
      'vidsrc-me.su',
      'vidsrc-embed.ru',
      'vidsrc-embed.su',
      'vsrc.su',
    ]),
    new VixSrc(fetcher),
    new Voe(fetcher),
    new YouTube(fetcher),
    new ExternalUrl(fetcher), // fallback extractor which must come last
  ].filter(extractor => !disabledExtractors.includes(extractor.id));
};
