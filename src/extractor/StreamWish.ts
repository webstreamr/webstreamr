import { Context, Format, Meta, UrlResult } from "../types";
import {
    buildMediaFlowProxyExtractorStreamUrl,
    guessHeightFromPlaylist
} from "../utils";
import { Extractor } from "./Extractor";

export class StreamWish extends Extractor {
    public readonly id = "StreamWish";
    public readonly label = "StreamWish(MFP)";
    public override viaMediaFlowProxy = true;

    private readonly domains = [
        'streamwish.com', 'streamwish.to', 'ajmidyad.sbs', 'khadhnayad.sbs', 'yadmalik.sbs',
        'hayaatieadhab.sbs', 'kharabnahs.sbs', 'atabkhha.sbs', 'atabknha.sbs', 'atabknhk.sbs',
        'atabknhs.sbs', 'abkrzkr.sbs', 'abkrzkz.sbs', 'wishembed.pro', 'mwish.pro', 'strmwis.xyz',
        'awish.pro', 'dwish.pro', 'vidmoviesb.xyz', 'embedwish.com', 'cilootv.store', 'uqloads.xyz',
        'tuktukcinema.store', 'doodporn.xyz', 'ankrzkz.sbs', 'volvovideo.top', 'streamwish.site',
        'wishfast.top', 'ankrznm.sbs', 'sfastwish.com', 'eghjrutf.sbs', 'eghzrutw.sbs',
        'guxhag.com', 'playembed.online', 'egsyxurh.sbs', 'egtpgrvh.sbs', 'flaswish.com',
        'obeywish.com', 'cdnwish.com', 'javsw.me', 'cinemathek.online', 'trgsfjll.sbs',
        'fsdcmo.sbs', 'hailindihg.com', 'anime4low.sbs', 'mohahhda.site', 'ma2d.store',
        'dancima.shop', 'swhoi.com', 'aiavh.com', 'gsfqzmqu.sbs', 'jodwish.com', 'swdyu.com',
        'strwish.com', 'asnwish.com', 'kravaxxa.com', 'wishonly.site', 'playerwish.com',
        'katomen.store', 'hlswish.com', 'streamwish.fun', 'swishsrv.com', 'iplayerhls.com',
        'hlsflast.com', '4yftwvrdz7.sbs', 'ghbrisk.com', 'hgbazooka.com', 'eb8gfmjn71.sbs',
        'cybervynx.com', 'edbrdl7pab.sbs', 'stbhg.click', 'dhcplay.com', 'strwish.xyz',
        'gradehgplus.com', 'tryzendm.com', 'hglink.to', 'dumbalag.com', 'haxloppd.com',
        'davioad.com', 'uasopt.com'
    ];

    private readonly dmcaHosts = [
        "hgplaycdn.com", "habetar.com", "yuguaab.com",
        "guxhag.com", "auvexiug.com", "xenolyzb.com"
    ];

    private readonly ruleHosts = [
        "dhcplay.com", "hglink.to"
    ];

    private readonly mainHosts = [
        "uasopt.com", "davioad.com",
        "haxloppd.com", "tryzendm.com",
        "dumbalag.com", "cavanhabg.com"
    ];

    private readonly masterPatterns = [
        /"(\/stream\/[^"]+master\.m3u8[^"]*)"/i,
        /'(\/stream\/[^']+master\.m3u8[^']*)'/i
    ];

    public supports(_ctx: Context, url: URL): boolean {
        return this.domains.some(d => url.host.includes(d));
    }

    public override normalize(url: URL): URL {
        return new URL(url.href.replace("/f/", "/e/").replace("/d/", "/e/"));
    }

    private rand<T>(arr: T[]): T {
        return arr[Math.floor(Math.random() * arr.length)]!;
    }

    private getMediaId(path: string): string {
        const id = path.match(/\/(?:e|f|d)\/([^/?#]+)/)?.[1];
        if (!id) throw new Error("StreamWish: Invalid media ID");
        return id;
    }

    private rewrite(url: URL): URL {
        const mediaId = this.getMediaId(url.pathname);
        const host = this.ruleHosts.includes(url.host)
            ? this.rand(this.mainHosts)
            : this.rand(this.dmcaHosts);
        return new URL(`https://${host}/e/${mediaId}`);
    }

    private extractIframe(html: string, base: URL): URL {
        const m = html.match(/<iframe[^>]+src=["']([^"']+)["']/i);
        return m?.[1] ? new URL(m[1], base) : base;
    }

    private extractMaster(text: string, base: URL): URL | null {
        for (const p of this.masterPatterns) {
            const m = text.match(p);
            if (m?.[1]) return new URL(m[1], base);
        }
        return null;
    }

    protected async extractInternal(
        ctx: Context,
        url: URL,
        meta: Meta,
        originalUrl?: URL
    ): Promise<UrlResult[]> {

        const normalized = this.normalize(url);
        const rewritten = this.rewrite(normalized);

        const referer = meta.referer ?? originalUrl?.href ?? rewritten.href;

        
        const requestHeaders: Record<string, string> = {
            Referer: referer
        };

        const requestCfg = {
            headers: requestHeaders
        };

        try {
            const embedHtml = await this.fetcher.text(ctx, rewritten, requestCfg);
            const iframeUrl = this.extractIframe(embedHtml, rewritten);

            const packedHtml = await this.fetcher.text(ctx, iframeUrl, requestCfg);
            const masterUrl = this.extractMaster(packedHtml, iframeUrl);

            if (masterUrl) {
                const height = await guessHeightFromPlaylist(
                    ctx,
                    this.fetcher,
                    masterUrl,
                    rewritten
                );

                return [{
                    url: masterUrl,
                    format: Format.hls,
                    label: this.label,
                    sourceId: this.id,
                    ttl: this.ttl,
                    meta: { ...meta, height }
                }];
            }
        } catch {
           
        }

        const proxyUrl = await buildMediaFlowProxyExtractorStreamUrl(
            ctx,
            this.fetcher,
            this.id,
            rewritten,
            requestHeaders
        );

        const height = await guessHeightFromPlaylist(
            ctx,
            this.fetcher,
            proxyUrl,
            rewritten
        );

        return [{
            url: proxyUrl,
            format: Format.hls,
            label: this.label,
            sourceId: this.id,
            ttl: this.ttl,
            meta: { ...meta, height }
        }];
    }
}
