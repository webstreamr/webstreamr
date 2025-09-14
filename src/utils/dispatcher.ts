import { socksDispatcher } from 'fetch-socks';
import { minimatch } from 'minimatch';
import { Dispatcher, ProxyAgent } from 'undici';
import { Context } from '../types';

export const getProxyForUrl = (ctx: Context, url: URL): URL | undefined => {
  const proxyConfig = ctx.config['proxyConfig'] || process.env['PROXY_CONFIG'];

  if (proxyConfig) {
    for (const rule of proxyConfig.split(',')) {
      const [hostPattern, proxy] = rule.split(/:(.+)/);
      if (!hostPattern || !proxy) {
        throw new Error(`Proxy rule "${rule}" is invalid.`);
      }

      if (hostPattern === '*' || minimatch(url.host, hostPattern)) {
        return proxy === 'false' ? undefined : new URL(proxy);
      }
    }
  } else if (process.env['ALL_PROXY']) {
    return new URL(process.env['ALL_PROXY']);
  }

  return undefined;
};

export const createProxyAgent = (proxyUrl: URL): Dispatcher => {
  if (proxyUrl.protocol === 'socks5:') {
    return socksDispatcher({ type: 5, host: proxyUrl.hostname, port: parseInt(proxyUrl.port) });
  }

  return new ProxyAgent({ uri: proxyUrl.href });
};
