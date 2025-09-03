import { socksDispatcher } from 'fetch-socks';
import { Agent, Dispatcher, interceptors, ProxyAgent, setGlobalDispatcher } from 'undici';

process.env['CACHE_DIR'] = '/dev/null';

jest.mock('randomstring', () => ({
  generate: jest.fn(() => 'mocked-random-string'),
}));

beforeEach(() => {
  jest.spyOn(Date, 'now').mockImplementation(() => 639837296000);
});

console.log = console.warn = console.error = console.info = console.debug = () => { /* disable in favor of logger */ };

let dispatcher: Dispatcher;
if (process.env['ALL_PROXY']) {
  const proxyUrl = new URL(process.env['ALL_PROXY']);
  if (proxyUrl.protocol === 'socks5:') {
    dispatcher = socksDispatcher({ type: 5, host: proxyUrl.hostname, port: parseInt(proxyUrl.port) }, { allowH2: true });
  } else {
    dispatcher = new ProxyAgent({ uri: proxyUrl.href, allowH2: true });
  }
} else {
  dispatcher = new Agent({ allowH2: true });
}
dispatcher.compose(
  interceptors.dns(),
  interceptors.retry({ maxRetries: 3 }),
);
setGlobalDispatcher(dispatcher);
