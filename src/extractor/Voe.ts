import bytes from 'bytes';
import * as cheerio from 'cheerio';
import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import {
  buildMediaFlowProxyExtractorStreamUrl,
  supportsMediaFlowProxy,
} from '../utils';
import { Extractor } from './Extractor';

/** @see https://github.com/Gujal00/ResolveURL/blob/master/script.module.resolveurl/lib/resolveurl/plugins/voesx.py */
export class Voe extends Extractor {
  public readonly id = 'voe';

  public readonly label = 'VOE (via MediaFlow Proxy)';

  public override viaMediaFlowProxy = true;

  public supports(ctx: Context, url: URL): boolean {
    const supportedDomain = null !== url.host.match(/voe/)
      || [
        '19turanosephantasia.com',
        '20demidistance9elongations.com',
        '30sensualizeexpression.com',
        '321naturelikefurfuroid.com',
        '35volitantplimsoles5.com',
        '449unceremoniousnasoseptal.com',
        '745mingiestblissfully.com',
        'adrianmissionminute.com',
        'alleneconomicmatter.com',
        'antecoxalbobbing1010.com',
        'apinchcaseation.com',
        'audaciousdefaulthouse.com',
        'availedsmallest.com',
        'bigclatterhomesguideservice.com',
        'boonlessbestselling244.com',
        'bradleyviewdoctor.com',
        'brittneystandardwestern.com',
        'brucevotewithin.com',
        'chromotypic.com',
        'chuckle-tube.com',
        'cindyeyefinal.com',
        'counterclockwisejacky.com',
        'crownmakermacaronicism.com',
        'cyamidpulverulence530.com',
        'diananatureforeign.com',
        'donaldlineelse.com',
        'edwardarriveoften.com',
        'erikcoldperson.com',
        'figeterpiazine.com',
        'fittingcentermondaysunday.com',
        'fraudclatterflyingcar.com',
        'gamoneinterrupted.com',
        'generatesnitrosate.com',
        'graceaddresscommunity.com',
        'greaseball6eventual20.com',
        'guidon40hyporadius9.com',
        'heatherdiscussionwhen.com',
        'housecardsummerbutton.com',
        'jamessoundcost.com',
        'jamiesamewalk.com',
        'jasminetesttry.com',
        'jayservicestuff.com',
        'jennifercertaindevelopment.com',
        'jilliandescribecompany.com',
        'johnalwayssame.com',
        'jonathansociallike.com',
        'josephseveralconcern.com',
        'kathleenmemberhistory.com',
        'kellywhatcould.com',
        'kennethofficialitem.com',
        'kristiesoundsimply.com',
        'launchreliantcleaverriver.com',
        'lisatrialidea.com',
        'loriwithinfamily.com',
        'lukecomparetwo.com',
        'mariatheserepublican.com',
        'matriculant401merited.com',
        'maxfinishseveral.com',
        'metagnathtuggers.com',
        'michaelapplysome.com',
        'nathanfromsubject.com',
        'nectareousoverelate.com',
        'nonesnanking.com',
        'paulkitchendark.com',
        'realfinanceblogcenter.com',
        'rebeccaneverbase.com',
        'reputationsheriffkennethsand.com',
        'richardsignfish.com',
        'roberteachfinal.com',
        'robertordercharacter.com',
        'robertplacespace.com',
        'sandratableother.com',
        'sandrataxeight.com',
        'scatch176duplicities.com',
        'sethniceletter.com',
        'shannonpersonalcost.com',
        'simpulumlamerop.com',
        'stevenimaginelittle.com',
        'strawberriesporail.com',
        'telyn610zoanthropy.com',
        'timberwoodanotia.com',
        'toddpartneranimal.com',
        'toxitabellaeatrebates306.com',
        'uptodatefinishconferenceroom.com',
        'v-o-e-unblock.com',
        'valeronevijao.com',
        'wolfdyslectic.com',
        'yodelswartlike.com',
      ].includes(url.host);

    return supportedDomain && supportsMediaFlowProxy(ctx);
  }

  public override normalize(url: URL): URL {
    return new URL(`/${url.pathname.split('/').slice(-1)[0]}`, url);
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const headers = { Referer: meta.referer ?? url.href };

    const html = await this.fetcher.text(ctx, url, { headers });

    const redirectMatch = html.match(/window\.location\.href\s*=\s*'([^']+)/);
    if (redirectMatch && redirectMatch[1]) {
      return await this.extractInternal(ctx, new URL(redirectMatch[1]), meta);
    }

    if (/An error occurred during encoding/.test(html)) {
      throw new NotFoundError();
    }

    const $ = cheerio.load(html);
    const title = $('meta[name="description"]').attr('content')?.trim().replace(/^Watch /, '').replace(/ at VOE$/, '').trim();

    const sizeMatch = html.matchAll(/[\d.]+ ?[GM]B/g).toArray().at(-1);
    const heightMatch = html.match(/<b>(\d{3,})p<\/b>/);

    const playlistUrl = await buildMediaFlowProxyExtractorStreamUrl(ctx, this.fetcher, 'Voe', url, headers);

    return [
      {
        url: playlistUrl,
        format: Format.hls,
        label: this.label,
        sourceId: `${this.id}_${meta.countryCodes?.join('_')}`,
        ttl: this.ttl,
        meta: {
          ...meta,
          title,
          ...(sizeMatch && { bytes: bytes.parse(sizeMatch[0] as string) as number }),
          ...(heightMatch && { height: parseInt(heightMatch[1] as string) }),
        },
      },
    ];
  };
}
