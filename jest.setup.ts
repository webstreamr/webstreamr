import { socksDispatcher } from 'fetch-socks';
import { ProxyAgent, setGlobalDispatcher } from 'undici';

jest.mock('randomstring', () => ({
  generate: jest.fn(() => 'mocked-random-string'),
}));

beforeEach(() => {
  jest.spyOn(Date, 'now').mockImplementation(() => 639837296000);
});

if (process.env['ALL_PROXY']) {
  const proxyUrl = new URL(process.env['ALL_PROXY']);
  if (proxyUrl.protocol === 'socks5:') {
    setGlobalDispatcher(socksDispatcher({ type: 5, host: proxyUrl.hostname, port: parseInt(proxyUrl.port) }));
  } else {
    setGlobalDispatcher(new ProxyAgent({ uri: proxyUrl.href }));
  }
}
