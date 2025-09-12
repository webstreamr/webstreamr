import { socksDispatcher } from 'fetch-socks';
import { Agent, Dispatcher, interceptors, ProxyAgent } from 'undici';

const createBasicDispatcher = (): Dispatcher => {
  if (process.env['ALL_PROXY']) {
    const proxyUrl = new URL(process.env['ALL_PROXY']);
    if (proxyUrl.protocol === 'socks5:') {
      return socksDispatcher({ type: 5, host: proxyUrl.hostname, port: parseInt(proxyUrl.port) }, { allowH2: true });
    } else {
      return new ProxyAgent({ uri: proxyUrl.href, allowH2: true });
    }
  } else {
    return new Agent({ allowH2: true });
  }
};

export const createDispatcher = (): Dispatcher => {
  return createBasicDispatcher().compose(
    interceptors.dns(),
    interceptors.retry({ maxRetries: 3 }),
  );
};
