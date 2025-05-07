import { ContentType, Manifest, addonBuilder } from 'stremio-addon-sdk';
import { Handler, HandlerStream, handleKinoKiste, handleMeineCloud } from './handler';
import { fulfillAllPromises, logInfo } from './utils';

const manifest: Manifest = {
  id: process.env['MANIFEST_ID'] || '',
  version: '0.0.1',
  name: process.env['MANIFEST_NAME'] || '',
  description: 'Provides HTTP streams from scraped websites. Currently supports KinoKiste (DE) and MeineCloud (DE).',
  resources: [
    'stream',
  ],
  types: [
    'movie',
    'series',
  ],
  catalogs: [],
  idPrefixes: ['tt'],
  behaviorHints: {
    p2p: false,
    configurable: true,
    configurationRequired: true,
  },
  config: [
    {
      key: 'de',
      type: 'checkbox',
      title: '🇩🇪 DE | KinoKiste, MeineCloud',
    },
  ],
};
const builder = new addonBuilder(manifest);

type RequestConfig = Record<string, boolean | string | number>;

const collectHandlers = (config: RequestConfig): Handler[] => {
  const handlers: Handler[] = [];

  if ('de' in config) {
    handlers.push(handleKinoKiste, handleMeineCloud);
  }

  return handlers;
};

const sortStreams = (streams: HandlerStream[]): void => {
  streams.sort((a, b) => {
    const resolutionComparison = parseInt(b.resolution) - parseInt(a.resolution);
    if (resolutionComparison !== 0) {
      return resolutionComparison;
    }

    return parseFloat(b.size) - parseFloat(a.size);
  });
};

builder.defineStreamHandler(async (args: { type: ContentType; id: string; config?: RequestConfig }) => {
  logInfo(`Search stream for type "${args.type}" and id "${args.id}"`);

  const handlers = collectHandlers(args.config || {});
  if (handlers.length === 0) {
    logInfo('No handlers configured, bail out');

    return {
      streams: [{
        name: 'WebStreamr',
        title: '⚠️ No handlers configured. Please re-configure the plugin.',
        ytId: 'E4WlUXrJgy4',
      }],
    };
  }

  const streams: HandlerStream[] = [];
  const handlerPromises = handlers.map(async (handler) => {
    const handlerStreams = await handler(args);
    logInfo(`${handler.name} returned ${handlerStreams.length} streams`);

    streams.push(...handlerStreams);
  });
  await fulfillAllPromises(handlerPromises);

  sortStreams(streams);

  logInfo(`Return ${streams.length} streams`);
  return { streams };
});

export default builder.getInterface();
