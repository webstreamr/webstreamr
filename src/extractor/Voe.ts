import bytes from 'bytes';
import { NotFoundError } from '../error';
import { Context, Format, Meta, UrlResult } from '../types';
import {
  buildMediaFlowProxyExtractorStreamUrl,
  guessHeightFromPlaylist,
  supportsMediaFlowProxy,
} from '../utils';
import { Extractor } from './Extractor';

/** VOE(MFP) Extractor */
export class Voe extends Extractor {
  public readonly id = 'voe';
  public readonly label = 'VOE(MFP)';
  public override viaMediaFlowProxy = true;

  public supports(ctx: Context, url: URL): boolean {
    const supportedDomain
      = url.host.includes('voe')
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
          'goofy-banana.com',
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
          'kinoger.ru',
          'kristiesoundsimply.com',
          'launchreliantcleaverriver.com',
          'lisatrialidea.com',
          'loriwithinfamily.com',
          'lukecomparetwo.com',
          'lukesitturn.com',
          'mariatheserepublican.com',
          'matriculant401merited.com',
          'maxfinishseveral.com',
          'metagnathtuggers.com',
          'michaelapplysome.com',
          'mikaylaarealike.com',
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
          'walterprettytheir.com',
          'wolfdyslectic.com',
          'yodelswartlike.com',
          'crystaltreatmenteast.com',
          'lauradaydo.com',
          'smoki.cc',
        ].includes(url.host);

    return supportedDomain && supportsMediaFlowProxy(ctx);
  }

  public override normalize(url: URL): URL {
    return new URL(`/${url.pathname.split('/').at(-1)}`, url);
  }

  protected async extractInternal(ctx: Context, url: URL, meta: Meta): Promise<UrlResult[]> {
    const headers = { Referer: meta.referer ?? url.href };

    let html: string;
    try {
      html = await this.fetcher.text(ctx, url, { headers });
    } catch (error) {
      if (error instanceof NotFoundError && !url.href.includes('/e/')) {
        return await this.extractInternal(ctx, new URL(`/e${url.pathname}`, url.origin), meta);
      }
      throw error;
    }

    // Handle redirects
    const redirectMatch = html.match(/window\.location\.href\s*=\s*'([^']+)/);
    if (redirectMatch?.[1]) {
      return await this.extractInternal(ctx, new URL(redirectMatch[1]), meta);
    }

    // Extract title, size, height
    const title = html.match(/<meta name="description" content="([^"]+)"/)?.[1]
      ?.replace(/^Watch /, '')
      .replace(/ at VOE$/, '')
      .trim();

    const sizeMatch = Array.from(html.matchAll(/[\d.]+ ?[GM]B/g)).at(-1);
    const size = sizeMatch ? bytes.parse(sizeMatch[0] as string) as number : null;

    const playlistUrl = await buildMediaFlowProxyExtractorStreamUrl(ctx, this.fetcher, 'Voe', url, headers);
    if (!playlistUrl) throw new Error('VOE: failed to build playlist URL');

    const heightMatch = html.match(/<b>(\d{3,})p<\/b>/);
    const height = heightMatch
      ? parseInt(heightMatch[1] as string)
      : await guessHeightFromPlaylist(ctx, this.fetcher, playlistUrl, url);

    // Extract obfuscated JSON payload for subtitles
    const payloadMatch = html.match(/json">\["([^"]+)"]/);
    const scriptMatch = html.match(/<script\s*src="([^"]+)"/);
    let subtitles: string[] = [];

    if (payloadMatch?.[1] && scriptMatch?.[1]) {
      const payload = payloadMatch[1];
      const scriptUrl = new URL(scriptMatch[1], url.origin).href;
      const scriptText = await this.fetcher.text(ctx, new URL(scriptUrl));

      const lutsMatch = scriptText.match(/(\[(?:'\W{2}'[,\]]){1,9})/);
      if (lutsMatch?.[1]) {
        const decoded = this.voeDecode(payload, lutsMatch[1]);
        if (decoded.captions?.length) {
          subtitles = decoded.captions.map((c: { file: string }) =>
            `${url.origin}${c.file.startsWith('/') ? c.file : '/' + c.file}`,
          );
        }
      }
    }

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
          height,
          ...(size && size > 16777216 && { bytes: size }),
          subtitles,
        },
      },
    ];
  }

  protected voeDecode(ct: string, luts: string): { captions?: { file: string }[]; [key: string]: unknown } {
    const lut: string[] = luts
      .slice(2, -2)
      .split('\',\'')
      .map(i => i.replace(/([.*+?^${}()|[\]\\])/g, '\\$1'));

    let txt = '';
    for (const char of ct) {
      let x = char.charCodeAt(0);
      if (x > 64 && x < 91) x = ((x - 52) % 26) + 65;
      else if (x > 96 && x < 123) x = ((x - 84) % 26) + 97;
      txt += String.fromCharCode(x);
    }

    for (const pattern of lut) txt = txt.replace(new RegExp(pattern, 'g'), '');

    let ctDecoded = Buffer.from(txt, 'base64').toString('utf-8');
    ctDecoded = ctDecoded.split('').map(c => String.fromCharCode(c.charCodeAt(0) - 3)).join('');
    const reversed = ctDecoded.split('').reverse().join('');
    const finalDecoded = Buffer.from(reversed, 'base64').toString('utf-8');

    return JSON.parse(finalDecoded);
  }
}
