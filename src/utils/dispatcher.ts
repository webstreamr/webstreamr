import { socksDispatcher } from 'fetch-socks';
import { minimatch } from 'minimatch';
import { Dispatcher, ProxyAgent } from 'undici';

export const getProxyForUrl = (url: URL): URL | undefined => {
  const proxyConfig = process.env['PROXY_CONFIG'];

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

const proxyAgents = new Map<string, Dispatcher>();
export const getProxyAgent = (proxyUrl: URL): Dispatcher => {
  let proxyAgent = proxyAgents.get(proxyUrl.href);

  if (!proxyAgent) {
    proxyAgent = proxyUrl.protocol === 'socks5:'
      ? socksDispatcher({ type: 5, host: proxyUrl.hostname, port: parseInt(proxyUrl.port) })
      : new ProxyAgent({ uri: proxyUrl.href });

    proxyAgents.set(proxyUrl.href, proxyAgent);
  }

  return proxyAgent;
};
