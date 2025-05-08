import * as cheerio from 'cheerio';
import slugify from 'slugify';
import { Handler } from './types';
import { cachedFetchText, fulfillAllPromises, parseImdbId, parsePackedEmbed } from '../utils';

export class MeineCloud implements Handler {
  readonly id = 'meinecloud';

  readonly label = 'MeineCloud';

  readonly contentTypes = ['movie'];

  readonly languages = ['de'];

  readonly handle = async (id: string) => {
    if (!id.startsWith('tt')) {
      return Promise.resolve([]);
    }

    const html = await cachedFetchText(`https://meinecloud.click/movie/${parseImdbId(id).id}`);

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
}
