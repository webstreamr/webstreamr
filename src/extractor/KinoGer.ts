import crypto from 'crypto';
import { Context, Format, Meta, UrlResult } from '../types';
import { guessHeightFromPlaylist } from '../utils';
import { Extractor } from './Extractor';

/** @see https://github.com/Gujal00/ResolveURL/blob/master/script.module.resolveurl/lib/resolveurl/plugins/kinoger.py */
export class KinoGer extends Extractor {
  public readonly id = 'kinoger';

  public readonly label = 'KinoGer';

  public override readonly ttl: number = 21600000; // 6h

  public supports(_ctx: Context, url: URL): boolean {
    return [
      'asianembed.cam',
      'disneycdn.net',
      'dzo.vidplayer.live',
      'filedecrypt.link',
      'filma365.strp2p.site',
      'flimmer.rpmvip.com',
      'flixfilmesonline.strp2p.site',
      'kinoger.re',
      'moflix.rpmplay.xyz',
      'moflix.upns.xyz',
      'player.upn.one',
      'securecdn.shop',
      'shiid4u.upn.one',
      'srbe84.vidplayer.live',
      'strp2p.site',
      't1.p2pplay.pro',
      'tuktuk.rpmvid.com',
      'ultrastream.online',
      'videoland.cfd',
      'videoshar.uns.bio',
      'w1tv.xyz',
      'wasuytm.store',
    ].includes(url.host);
  }

  public override normalize(url: URL): URL {
    return new URL(`${url.origin}/api/v1/video?id=${url.hash.slice(1)}`);
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const headers = {
      'Origin': url.origin,
      'Referer': url.origin + '/',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
    };

    const hexData = await this.fetcher.text(ctx, url, { headers });

    const encrypted = Buffer.from(hexData.slice(0, -1), 'hex');
    const key = Buffer.from('6b69656d7469656e6d75613931316361', 'hex');
    const iv = Buffer.from('313233343536373839306f6975797472', 'hex');
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString();

    const { cf, title } = JSON.parse(decrypted) as { cf: string; title: string };

    const m3u8Url = new URL(cf);

    return [
      {
        url: m3u8Url,
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        ttl: this.ttl,
        meta: {
          ...meta,
          height: await guessHeightFromPlaylist(ctx, this.fetcher, m3u8Url, url, { headers: { Referer: url.href } }),
          title,
        },
        requestHeaders: {
          Referer: url.origin,
        },
      },
    ];
  };
}
