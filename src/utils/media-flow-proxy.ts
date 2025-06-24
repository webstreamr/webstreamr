import { Context } from '../types';

export const supportsMediaFlowProxy = (ctx: Context): boolean => !!(ctx.config['mediaFlowProxyUrl'] && ctx.config['mediaFlowProxyPassword']);

export const buildMediaFlowProxyExtractorRedirectUrl = (ctx: Context, host: string, url: URL): URL => {
  const mediaFlowProxyUrl = new URL(`${ctx.config.mediaFlowProxyUrl}/extractor/video`);

  const params = new URLSearchParams();
  params.append('host', host);
  params.append('redirect_stream', 'true');
  params.append('api_password', `${ctx.config.mediaFlowProxyPassword}`);
  params.append('d', url.href);
  mediaFlowProxyUrl.search = params.toString();

  return mediaFlowProxyUrl;
};
