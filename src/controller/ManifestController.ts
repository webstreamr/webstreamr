import { Request, Response, Router } from 'express';
import { buildManifest } from '../utils';
import { Handler } from '../handler';
import { Config } from '../types';

export class ManifestController {
  public readonly router: Router;

  private readonly handlers: Handler[];

  constructor(handlers: Handler[]) {
    this.router = Router();

    this.handlers = handlers;

    this.router.get('/manifest.json', this.getManifest.bind(this));
    this.router.get('/:config/manifest.json', this.getManifest.bind(this));
  }

  private readonly getManifest = (req: Request, res: Response) => {
    const config: Config = JSON.parse(req.params['config'] || '{}');

    const manifest = buildManifest(this.handlers, config);

    res.setHeader('Content-Type', 'application/json');
    res.send(manifest);
  };
}
