import { Request, Response, Router } from 'express';
import { landingTemplate } from '../landingTemplate';
import { Source } from '../source';
import { Config } from '../types';
import { buildManifest, getDefaultConfig } from '../utils';

export class ConfigureController {
  public readonly router: Router;

  private readonly sources: Source[];

  public constructor(sources: Source[]) {
    this.router = Router();

    this.sources = sources;

    this.router.get('/configure', this.getConfigure.bind(this));
    this.router.get('/:config/configure', this.getConfigure.bind(this));
  }

  private getConfigure(req: Request, res: Response) {
    const config: Config = JSON.parse(req.params['config'] || JSON.stringify(getDefaultConfig()));

    // Convenience preset for ElfHosted WebStreamr bundle including Media Flow Proxy
    if (!req.params['config'] && req.host.endsWith('elfhosted.com')) {
      config.mediaFlowProxyUrl = `${req.protocol}://${req.host.replace('webstreamr', 'mediaflow-proxy')}`;
    }

    const manifest = buildManifest(this.sources, config);

    res.setHeader('content-type', 'text/html');
    res.send(landingTemplate(manifest));
  };
}
