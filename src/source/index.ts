import { Fetcher } from '../utils';
import { CineHDPlus } from './CineHDPlus';
import { Cuevana } from './Cuevana';
import { Eurostreaming } from './Eurostreaming';
import { FrenchCloud } from './FrenchCloud';
import { HomeCine } from './HomeCine';
import { KinoGer } from './KinoGer';
import { MegaKino } from './MegaKino';
import { MeineCloud } from './MeineCloud';
import { MostraGuarda } from './MostraGuarda';
import { Movix } from './Movix';
import { Soaper } from './Soaper';
import { StreamKiste } from './StreamKiste';
import { Source } from './types';
import { VerHdLink } from './VerHdLink';
import { VidSrc } from './VidSrc';
import { VixSrc } from './VixSrc';

export * from './types';

export const createSources = (fetcher: Fetcher): Source[] => [
  // multi
  new VixSrc(fetcher),
  // EN
  // new PrimeWire(fetcher), // links are shortened and redirect works via obfuscated JS
  new Soaper(fetcher),
  new VidSrc(fetcher),
  // ES / MX
  new CineHDPlus(fetcher),
  new Cuevana(fetcher),
  new HomeCine(fetcher),
  new VerHdLink(fetcher),
  // DE
  new KinoGer(fetcher),
  new MegaKino(fetcher),
  new MeineCloud(fetcher),
  new StreamKiste(fetcher),
  // FR
  // new Frembed(fetcher), // timing-out regularly since days
  new FrenchCloud(fetcher),
  new Movix(fetcher),
  // IT
  new Eurostreaming(fetcher),
  new MostraGuarda(fetcher),
];
