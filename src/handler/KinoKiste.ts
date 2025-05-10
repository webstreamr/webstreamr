import * as cheerio from 'cheerio';
import slugify from 'slugify';
import { Handler } from './types';
import { ImdbId, cachedFetchText, fulfillAllPromises, parseImdbId } from '../utils';
import { EmbedExtractorRegistry } from '../embed-extractor';

export class KinoKiste implements Handler {
  readonly id = 'kinokiste';

  readonly label = 'KinoKiste';

  readonly contentTypes = ['series'];

  readonly languages = ['de'];

  readonly handle = async (id: string) => {
    if (!id.startsWith('tt')) {
      return Promise.resolve([]);
    }

    const imdbId = parseImdbId(id);

    const seriesPageUrl = await this.fetchSeriesPageUrl(imdbId);
    if (!seriesPageUrl) {
      return Promise.resolve([]);
    }

    const html = await cachedFetchText(seriesPageUrl);

    const $ = cheerio.load(html);

    return fulfillAllPromises(
      $(`[data-num="${imdbId.series}x${imdbId.episode}"]`).map((_i, urlWrapperElement) => {
        return $(urlWrapperElement).siblings('.mirrors').children('[data-link]')
          .map((_i, urlElement) => ({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            embedId: slugify($(urlElement).attr('data-m')!),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            embedUrl: $(urlElement).attr('data-link')!
              .replace(/^(https:)?\/\//, 'https://'),
          }))
          .toArray()
          .filter(({ embedId }) => embedId.match(/^(dropload|supervideo)$/));
      })
        .toArray()
        .map(({ embedId, embedUrl }) => EmbedExtractorRegistry[embedId]?.extract(embedUrl, 'de'))
        .filter(stream => stream !== undefined),
    );
  };

  private fetchSeriesPageUrl = async (imdbId: ImdbId): Promise<string | undefined> => {
    const html = await cachedFetchText(`https://kinokiste.live/serien/?do=search&subaction=search&story=${imdbId.id}`);

    const $ = cheerio.load(html);

    return $('.item-video a[href]:first')
      .map((_i, el) => $(el).attr('href'))
      .get(0);
  };
}
