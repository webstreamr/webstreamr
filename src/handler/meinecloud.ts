import * as cheerio from 'cheerio';
import slugify from 'slugify';
import { Handler } from './types';
import { cachedFetchText, fulfillAllPromises, parseImdbId, parsePackedEmbed } from '../utils';

export const handleMeineCloud: Handler = async ({ type, id }) => {
  if (type !== 'movie' || !id.startsWith('tt')) {
    return Promise.resolve([]);
  }

  const imdbId = parseImdbId(id);
  const html = await cachedFetchText(`https://meinecloud.click/movie/${imdbId.id}`);

  const $ = cheerio.load(html);
  const streamsPromises = $('[data-link!=""]')
    .map((_i, el) => ({
      group: slugify($(el).text()),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      url: $(el).attr('data-link')!
        .replace(/^(https:)?\/\//, 'https://')
        .replace('/e/', '/')
        .replace('/embed-', '/'),
    }))
    .toArray()
    .filter(({ url }) => url.match(/dropload|supervideo/))
    .map(async ({ group, url }) => {
      const { url: finalUrl, resolution, size } = await parsePackedEmbed(url);

      return {
        url: finalUrl,
        name: `WebStreamr DE | ${resolution}`,
        title: `MeineCloud - ${group} | 💾 ${size} | 🇩🇪`,
        behaviorHints: {
          group: `webstreamr-meinecloud-${group}`,
        },
        resolution,
        size,
      };
    });

  return fulfillAllPromises(streamsPromises);
};
