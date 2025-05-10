import express, { NextFunction, Request, Response } from 'express';
import { landingTemplate } from './landingTemplate';
import { Handler, KinoKiste, MeineCloud } from './handler';
import { buildManifest, fulfillAllPromises, logInfo } from './utils';
import { Config, StreamWithMeta } from './types';

const addon = express();

const handlers: Handler[] = [
  new KinoKiste(),
  new MeineCloud(),
];

addon.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (process.env['NODE_ENV'] === 'production') {
    res.setHeader('Cache-Control', 'max-age=3600, public');
  }

  next();
});

addon.get('/', (_req: Request, res: Response) => {
  res.redirect('/configure');
});

addon.get('/configure', (_req: Request, res: Response) => {
  const manifest = buildManifest(handlers, {});

  res.setHeader('content-type', 'text/html');
  res.send(landingTemplate(manifest));
});

addon.get('/:config/configure', (req: Request, res: Response) => {
  const config: Config = JSON.parse(req.params['config'] || '{}');

  const manifest = buildManifest(handlers, config);

  res.setHeader('content-type', 'text/html');
  res.send(landingTemplate(manifest));
});

addon.get('/manifest.json', (_req: Request, res: Response) => {
  const manifest = buildManifest(handlers, {});

  res.setHeader('Content-Type', 'application/json');
  res.send(manifest);
});

addon.get('/:config/manifest.json', (req: Request, res: Response) => {
  const config: Config = JSON.parse(req.params['config'] || '{}');

  const manifest = buildManifest(handlers, config);

  res.setHeader('Content-Type', 'application/json');
  res.send(manifest);
});

addon.get('/:config/stream/:type/:id.json', async function (req: Request, res: Response) {
  const config: Config = JSON.parse(req.params['config'] || '{}');
  const type: string = req.params['type'] || '';
  const id: string = req.params['id'] || '';

  logInfo(`Search stream for type "${type}" and id "${id}"`);

  res.setHeader('Content-Type', 'application/json');

  const selectedHandlers = handlers.filter(handler => handler.id in config);
  if (selectedHandlers.length === 0) {
    logInfo('No handlers configured, bail out');

    res.send(JSON.stringify({
      streams: [{
        name: 'WebStreamr',
        title: '⚠️ No handlers found. Please re-configure the plugin.',
        ytId: 'E4WlUXrJgy4',
      }],
    }));
    return;
  }

  const streams: StreamWithMeta[] = [];
  const handlerPromises = selectedHandlers.map(async (handler) => {
    if (!handler.contentTypes.includes(type)) {
      return;
    }

    const handlerStreams = await handler.handle(id);
    logInfo(`${handler.id} returned ${handlerStreams.length} streams`);

    streams.push(...handlerStreams);
  });
  await fulfillAllPromises(handlerPromises);

  streams.sort((a, b) => {
    const resolutionComparison = parseInt(b.resolution ?? '0') - parseInt(a.resolution ?? '0');
    if (resolutionComparison !== 0) {
      return resolutionComparison;
    }

    return parseFloat(b.size ?? '0') - parseFloat(a.size ?? '0');
  });

  logInfo(`Return ${streams.length} streams`);
  res.send(JSON.stringify({ streams }));
});

const port = parseInt(process.env['PORT'] || '51546');
addon.listen(port, () => {
  logInfo(`Add-on Repository URL: http://127.0.0.1:${port}/manifest.json`);
});
