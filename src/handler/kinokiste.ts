import * as cheerio from 'cheerio';
import slugify from 'slugify';
import { ImdbId, cachedFetchText, fulfillAllPromises, parseImdbId, parsePackedEmbed } from '../utils';
import { Handler } from './types';

const fetchSeriesPageUrl = async (imdbId: ImdbId): Promise<string | undefined> => {
  const html = await cachedFetchText(`https://kinokiste.live/serien/?do=search&subaction=search&story=${imdbId.id}`);

  const $ = cheerio.load(html);

  return $('.item-video a[href]:first')
    .map((_i, el) => $(el).attr('href'))
    .get(0);
};

const fetchStreamData = async (imdbId: ImdbId, seriesPageUrl: string): Promise<{ group: string; url: string }[]> => {
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

export const handleKinoKiste: Handler = async ({ type, id }) => {
  if (type !== 'series' || !id.startsWith('tt')) {
    return Promise.resolve([]);
  }

  const imdbId = parseImdbId(id);

  const seriesPageUrl = await fetchSeriesPageUrl(imdbId);
  if (!seriesPageUrl) {
    return Promise.resolve([]);
  }

  const streamsPromises = (await fetchStreamData(imdbId, seriesPageUrl))
    .map(async ({ group, url }) => {
      const { url: finalUrl, resolution, size } = await parsePackedEmbed(url);

      return {
        url: finalUrl,
        name: `WebStreamr DE | ${resolution}`,
        title: `KinoKiste - ${group} | 💾 ${size} | 🇩🇪`,
        behaviorHints: {
          group: `webstreamr-kinokiste-${group}`,
        },
        resolution,
        size,
      };
    });

  return fulfillAllPromises(streamsPromises);
};
