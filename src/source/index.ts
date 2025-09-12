import { Fetcher } from '../utils';
import { CineHDPlus } from './CineHDPlus';
import { Cuevana } from './Cuevana';
import { Einschalten } from './Einschalten';
import { Eurostreaming } from './Eurostreaming';
import { FourKHDHub } from './FourKHDHub';
import { Frembed } from './Frembed';
import { FrenchCloud } from './FrenchCloud';
import { HomeCine } from './HomeCine';
import { KinoGer } from './KinoGer';
import { MegaKino } from './MegaKino';
import { MeineCloud } from './MeineCloud';
import { MostraGuarda } from './MostraGuarda';
import { Movix } from './Movix';
import { PrimeWire } from './PrimeWire';
import { Source } from './Source';
import { StreamKiste } from './StreamKiste';
import { VerHdLink } from './VerHdLink';
import { VidSrc } from './VidSrc';
import { VixSrc } from './VixSrc';
import { XPrime } from './XPrime';

export * from './Source';

export const createSources = (fetcher: Fetcher): Source[] => [
  // multi
  new FourKHDHub(fetcher),
  new VixSrc(fetcher),
  // EN
  new PrimeWire(fetcher),
  // new Soaper(fetcher), // "temporarily" rate-limited for over a week
  new VidSrc(fetcher),
  new XPrime(fetcher),
  // ES / MX
  new CineHDPlus(fetcher),
  new Cuevana(fetcher),
  new HomeCine(fetcher),
  new VerHdLink(fetcher),
  // DE
  new Einschalten(fetcher),
  new KinoGer(fetcher),
  new MegaKino(fetcher),
  new MeineCloud(fetcher),
  new StreamKiste(fetcher),
  // FR
  new Frembed(fetcher),
  new FrenchCloud(fetcher),
  new Movix(fetcher),
  // IT
  new Eurostreaming(fetcher),
  new MostraGuarda(fetcher),
];
