import * as cheerio from 'cheerio';
import slugify from 'slugify';
import { Handler } from './types';
import { ImdbId, cachedFetchText, fulfillAllPromises, parseImdbId, parsePackedEmbed } from '../utils';

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

    const streamsPromises = (await this.fetchStreamData(imdbId, seriesPageUrl))
      .map(async ({ group, url }) => {
        const { url: finalUrl, resolution, size } = await parsePackedEmbed(url);

        return {
          url: finalUrl,
          name: `WebStreamr DE | ${resolution}`,
          title: `${this.label} - ${group} | 💾 ${size} | 🇩🇪`,
          behaviorHints: {
            group: `webstreamr-${this.id}-${group}`,
          },
          resolution,
          size,
        };
      });

    return fulfillAllPromises(streamsPromises);
  };

  private fetchSeriesPageUrl = async (imdbId: ImdbId): Promise<string | undefined> => {
    const html = await cachedFetchText(`https://kinokiste.live/serien/?do=search&subaction=search&story=${imdbId.id}`);

    const $ = cheerio.load(html);

    return $('.item-video a[href]:first')
      .map((_i, el) => $(el).attr('href'))
      .get(0);
  };

  private fetchStreamData = async (imdbId: ImdbId, seriesPageUrl: string): Promise<{ group: string; url: string }[]> => {
    const html = await cachedFetchText(seriesPageUrl);

    const $ = cheerio.load(html);

    return $(`[data-num="${imdbId.series}x${imdbId.episode}"]`).map((_i, urlWrapperElement) => {
      return $(urlWrapperElement).siblings('.mirrors').children('[data-link]')
        .map((_i, urlElement) => ({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          group: slugify($(urlElement).attr('data-m')!),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          url: $(urlElement).attr('data-link')!
            .replace(/^(https:)?\/\//, 'https://')
            .replace('/e/', '/')
            .replace('/embed-', '/'),
        }))
        .toArray()
        .filter(({ url }) => url.match(/dropload|supervideo/));
    }).toArray();
  };
}
