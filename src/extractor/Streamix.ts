import { Context, Format, Meta, UrlResult } from '../types';
import { Extractor } from './Extractor';

interface StreamixResponse {
  streaming_url?: string;
}

export class Streamix extends Extractor {
  public readonly id = 'streamix';
  public readonly label = 'Streamix';

  public supports(_ctx: Context, url: URL): boolean {
    return /st(?:rea)?mix\.(so|io)/i.test(url.host);
  }

  protected async extractInternal(
    ctx: Context,
    url: URL,
    meta: Meta,
  ): Promise<UrlResult[]> {
    const match = url.href.match(
      /st(?:rea)?mix\.(?:so|io)\/(?:e|v)\/([0-9a-zA-Z]+)/i,
    );

    if (!match) {
      return [];
    }

    const mediaId = match[1];
    const apiUrl = new URL(`/ajax/stream?filecode=${mediaId}`, url.origin);
    const referer = `${url.origin}/`;

    const jsonText = await this.fetcher.text(ctx, apiUrl, {
      headers: {
        Referer: referer,
      },
    });

    let data: StreamixResponse;
    try {
      data = JSON.parse(jsonText);
    } catch {
      return [];
    }

    if (!data.streaming_url) {
      return [];
    }

    return [
      {
        url: new URL(data.streaming_url),
        format: Format.hls,
        label: this.label,
        ttl: 3600000,
        requestHeaders: {
          Referer: referer,
          Origin: url.origin,
        },
        meta: {
          ...meta,
          sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        },
      },
    ];
  }
}
