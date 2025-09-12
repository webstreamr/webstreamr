import { socksDispatcher } from 'fetch-socks';
import { minimatch } from 'minimatch';
import { Agent, Dispatcher, interceptors, ProxyAgent } from 'undici';
import { Context } from '../types';

const createProxyAgent = (proxyUrl: URL): Dispatcher => {
  if (proxyUrl.protocol === 'socks5:') {
    return socksDispatcher({ type: 5, host: proxyUrl.hostname, port: parseInt(proxyUrl.port) }, { allowH2: true });
  }

  return new ProxyAgent({ uri: proxyUrl.href, allowH2: true });
};

const createBasicDispatcher = (ctx: Context, url: URL): Dispatcher => {
  const proxyConfig = ctx.config['proxyConfig'] || process.env['PROXY_CONFIG'];

  if (proxyConfig) {
    for (const rule of proxyConfig.split(',')) {
      const [hostPattern, proxy] = rule.split(/:(.+)/);
      if (!hostPattern || !proxy) {
        throw new Error(`Proxy rule "${rule}" is invalid.`);
      }

      if (hostPattern === '*' || minimatch(url.host, hostPattern)) {
        return createProxyAgent(new URL(proxy));
      }
    }
  } else if (process.env['ALL_PROXY']) {
    return createProxyAgent(new URL(process.env['ALL_PROXY']));
  }

  return new Agent({ allowH2: true });
};

export const createDispatcher = (ctx: Context, url: URL): Dispatcher => {
  return createBasicDispatcher(ctx, url).compose(
    interceptors.dns(),
    interceptors.retry({ maxRetries: 3 }),
  );
};
