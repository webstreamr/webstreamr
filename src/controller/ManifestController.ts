import { Request, Response, Router } from 'express';
import { Source } from '../source';
import { Config } from '../types';
import { buildManifest, getDefaultConfig } from '../utils';

export class ManifestController {
  public readonly router: Router;

  private readonly sources: Source[];

  public constructor(sources: Source[]) {
    this.router = Router();

    this.sources = sources;

    this.router.get('/manifest.json', this.getManifest.bind(this));
    this.router.get('/:config/manifest.json', this.getManifest.bind(this));
  }

  private getManifest(req: Request, res: Response) {
    const config: Config = JSON.parse(req.params['config'] || JSON.stringify(getDefaultConfig()));

    const manifest = buildManifest(this.sources, config);

    res.setHeader('Content-Type', 'application/json');
    res.send(manifest);
  };
}
