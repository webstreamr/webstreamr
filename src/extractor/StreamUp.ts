import crypto from 'crypto';
import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import { Extractor } from './Extractor';

/**
 * Port of:
 * https://github.com/Gujal00/ResolveURL/blob/master/script.module.resolveurl/lib/resolveurl/plugins/streamup.py
 */
export class StreamUp extends Extractor {
  public readonly id = 'streamup';
  public readonly label = 'StreamUp';
  public override readonly ttl = 6 * 60 * 60 * 1000; // 6 hours

  public supports(_ctx: Context, url: URL): boolean {
    return [
      'streamup.ws',
      'streamup.cc',
      'strmup.to',
      'strmup.cc',
      'vfaststream.com',
    ].includes(url.host);
  }

  public override normalize(url: URL): URL {
    return new URL(`/${url.pathname.split('/').at(-1)}`, url.origin);
  }

  protected async extractInternal(
    ctx: Context,
    url: URL,
    meta: Meta,
  ): Promise<UrlResult[]> {
    const referer = `${url.origin}/`;

    const headers = {
      'Referer': referer,
      'User-Agent': 'Mozilla/5.0',
    };

    const html = await this.fetcher.text(ctx, url, { headers });

    const sessionMatch = html.match(/'([a-f0-9]{32})'/);
    const encryptedMatch = html.match(/'([A-Za-z0-9+/=]{200,})'/);

    if (sessionMatch && encryptedMatch) {
      /* encrypted flow */
      const sessionId = sessionMatch[1] as string;
      const encryptedB64 = encryptedMatch[1] as string;

      const keyUrl = new URL(`/ajax/stream?session=${sessionId}`, url.origin);
      const keyB64 = await this.fetcher.text(ctx, keyUrl, { headers });

      const key = Buffer.from(keyB64, 'base64');
      const encrypted = Buffer.from(encryptedB64, 'base64');

      const iv = encrypted.subarray(0, 16);
      const ciphertext = encrypted.subarray(16);

      const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
      const decrypted = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final(),
      ]).toString('utf-8');

      const data = JSON.parse(decrypted) as {
        streaming_url?: string;
      };

      streamUrl = data.streaming_url;
    } else {
      /* fallback flow */
      const filecode = url.pathname.split('/').at(-1);
      const apiUrl = new URL(`/ajax/stream?filecode=${filecode}`, url.origin);

      const jsonText = await this.fetcher.text(ctx, apiUrl, { headers });
      const data = JSON.parse(jsonText) as {
        streaming_url?: string;
      };

      streamUrl = data.streaming_url;
    }

    if (!streamUrl) {
      throw new NotFoundError();
    }

    /* cleanup identical to Python resolver */
    streamUrl = streamUrl
      .replace(/\\r\\n/g, '')
      .replace(/\r|\n/g, '')
      .replace(/\\\//g, '/');

    return [
      {
        url: new URL(streamUrl),
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        ttl: this.ttl,
        requestHeaders: {
          Referer: referer,
          Origin: url.origin,
        },
        meta: {
          ...meta,
        },
      },
    ];
  }
}
