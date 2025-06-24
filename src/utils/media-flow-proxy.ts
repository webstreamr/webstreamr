import { Config } from '../types';

export const hasMediaFlowProxy = (config: Config): boolean => !!(config['mediaFlowProxyUrl'] && config['mediaFlowProxyPassword']);

export const buildMediaFlowProxyExtractorRedirectUrl = (config: Config, host: string, url: URL): URL => {
  const mediaFlowProxyUrl = new URL(`${config.mediaFlowProxyUrl}/extractor/video`);

  const params = new URLSearchParams();
  params.append('host', host);
  params.append('redirect_stream', 'true');
  params.append('api_password', `${config.mediaFlowProxyPassword}`);
  params.append('d', url.href);
  mediaFlowProxyUrl.search = params.toString();

  return mediaFlowProxyUrl;
};
