import * as cheerio from 'cheerio';
import slugify from 'slugify';
import { Handler } from './types';
import { cachedFetchText, fulfillAllPromises, parseImdbId } from '../utils';
import { EmbedExtractorRegistry } from '../embed-extractor';

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

    return fulfillAllPromises(
      $('[data-link!=""]')
        .map((_i, el) => ({
          embedId: slugify($(el).text()),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          embedUrl: $(el).attr('data-link')!
            .replace(/^(https:)?\/\//, 'https://'),
        }))
        .toArray()
        .filter(({ embedId }) => embedId.match(/^(dropload|supervideo)$/))
        .map(({ embedId, embedUrl }) => EmbedExtractorRegistry[embedId]?.extract(embedUrl, 'de'))
        .filter(stream => stream !== undefined),
    );
  };
}
