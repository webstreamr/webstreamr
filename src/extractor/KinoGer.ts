import crypto from 'crypto';
import { Extractor } from './Extractor';
import { Fetcher, guessFromTitle } from '../utils';
import { Context, CountryCode, UrlResult } from '../types';

/** @see https://github.com/Gujal00/ResolveURL/blob/master/script.module.resolveurl/lib/resolveurl/plugins/kinoger.py */
export class KinoGer extends Extractor {
  public readonly id = 'kinoger';

  public readonly label = 'KinoGer';

  private readonly fetcher: Fetcher;

  public constructor(fetcher: Fetcher) {
    super();

    this.fetcher = fetcher;
  }

  public readonly supports = (_ctx: Context, url: URL): boolean => null !== url.host.match(/kinoger\.re|shiid4u\.upn\.one|moflix\.upns\.xyz|player\.upn\.one|wasuytm\.store|ultrastream\.online/);

  public override readonly normalize = (url: URL): URL => new URL(`${url.origin}/api/v1/video?id=${url.hash.slice(1)}`);

  protected readonly extractInternal = async (ctx: Context, url: URL, countryCode: CountryCode): Promise<UrlResult[]> => {
    const hexData = await this.fetcher.text(ctx, url, { headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36' } });

    const encrypted = Buffer.from(hexData, 'hex');
    const key = Buffer.from('6b69656d7469656e6d75613931316361', 'hex');
    const iv = Buffer.from('313233343536373839306f6975797472', 'hex');
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString();

    const { cf, title } = JSON.parse(decrypted) as { cf: string; title: string };

    const height = guessFromTitle(title);

    return [
      {
        url: new URL(cf),
        label: this.label,
        sourceId: `${this.id}_${countryCode}`,
        ttl: this.ttl,
        meta: {
          countryCode,
          title,
          ...(height && { height }),
        },
        requestHeaders: {
          Referer: ctx.referer?.href as string,
        },
      },
    ];
  };
}
