import { ContentType, Manifest, addonBuilder } from 'stremio-addon-sdk';
import { Handler, HandlerStream, KinoKiste, MeineCloud } from './handler';
import { fulfillAllPromises, iso2ToFlag, logInfo } from './utils';

const handlers: Handler[] = [
  new KinoKiste(),
  new MeineCloud(),
];

const manifest: Manifest = {
  id: process.env['MANIFEST_ID'] || '',
  version: '0.0.1',
  name: process.env['MANIFEST_NAME'] || '',
  description: `Provides HTTP URLs from streaming websites.`,
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
  config: [],
};

handlers.forEach((handler) => {
  manifest.config?.push({
    key: handler.id,
    type: 'checkbox',
    title: `${handler.languages.map(language => iso2ToFlag(language) + ' ' + language.toUpperCase()).join(', ')} | ${handler.label}`,
  });
});

const builder = new addonBuilder(manifest);

type RequestConfig = Record<string, boolean | string | number>;

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

  const selectedHandlers = handlers.filter(handler => handler.id in (args.config || {}));
  if (selectedHandlers.length === 0) {
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
  const handlerPromises = selectedHandlers.map(async (handler) => {
    if (!handler.contentTypes.includes(args.type)) {
      return;
    }

    const handlerStreams = await handler.handle(args.id);
    logInfo(`${handler.id} returned ${handlerStreams.length} streams`);

    streams.push(...handlerStreams);
  });
  await fulfillAllPromises(handlerPromises);

  sortStreams(streams);

  logInfo(`Return ${streams.length} streams`);
  return { streams };
});

export default builder.getInterface();
