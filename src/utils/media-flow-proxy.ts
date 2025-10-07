import { Context } from '../types';
import { Fetcher } from './Fetcher';

interface ExtractResult {
  destination_url: string;
  request_headers: Record<string, string>;
  mediaflow_proxy_url: string;
  query_params: Record<string, string>;
}

export const supportsMediaFlowProxy = (ctx: Context): boolean => !!ctx.config['mediaFlowProxyUrl'];

const buildMediaFlowProxyExtractorUrl = (ctx: Context, host: string, url: URL, headers: Record<string, string>): URL => {
  const mediaFlowProxyUrl = new URL('/extractor/video', ctx.config.mediaFlowProxyUrl);

  mediaFlowProxyUrl.searchParams.append('host', host);
  mediaFlowProxyUrl.searchParams.append('api_password', `${ctx.config.mediaFlowProxyPassword}`);
  mediaFlowProxyUrl.searchParams.append('d', url.href);

  for (const headerKey in headers) {
    mediaFlowProxyUrl.searchParams.set('h_' + headerKey.toLowerCase(), headers[headerKey] as string);
  }

  return mediaFlowProxyUrl;
};

export const buildMediaFlowProxyExtractorRedirectUrl = (ctx: Context, host: string, url: URL, headers: Record<string, string> = {}): URL => {
  const mediaFlowProxyUrl = buildMediaFlowProxyExtractorUrl(ctx, host, url, headers);

  mediaFlowProxyUrl.searchParams.append('redirect_stream', 'true');

  return mediaFlowProxyUrl;
};

export const buildMediaFlowProxyExtractorStreamUrl = async (ctx: Context, fetcher: Fetcher, host: string, url: URL, headers: Record<string, string>): Promise<URL> => {
  const mediaFlowProxyUrl = buildMediaFlowProxyExtractorUrl(ctx, host, url, headers);

  const extractResult: ExtractResult = await fetcher.json(ctx, mediaFlowProxyUrl, { queueLimit: 4, queueTimeout: 10000, timeout: 20000 });

  const streamUrl = new URL(extractResult.mediaflow_proxy_url);

  for (const queryParamsKey in extractResult.query_params) {
    streamUrl.searchParams.append(queryParamsKey, extractResult.query_params[queryParamsKey] as string);
  }
  for (const requestHeadersKey in extractResult.request_headers) {
    streamUrl.searchParams.append(`h_${requestHeadersKey}`, extractResult.request_headers[requestHeadersKey] as string);
  }
  streamUrl.searchParams.append('d', extractResult.destination_url);

  return streamUrl;
};
