import { Request, Response, Router } from 'express';
import { Extractor } from '../extractor';
import { landingTemplate } from '../landingTemplate';
import { Source } from '../source';
import { Config } from '../types';
import { buildManifest, getDefaultConfig, isElfHostedInstance } from '../utils';

export class ConfigureController {
  public readonly router: Router;

  private readonly sources: Source[];
  private readonly extractors: Extractor[];

  public constructor(sources: Source[], extractors: Extractor[]) {
    this.router = Router();

    this.sources = sources;
    this.extractors = extractors;

    this.router.get('/configure', this.getConfigure.bind(this));
    this.router.get('/:config/configure', this.getConfigure.bind(this));
  }

  private getConfigure(req: Request, res: Response) {
    const config: Config = JSON.parse(req.params['config'] as string || JSON.stringify(getDefaultConfig()));

    // Convenience preset for ElfHosted WebStreamr bundle including Media Flow Proxy
    if (!req.params['config'] && isElfHostedInstance(req)) {
      config.mediaFlowProxyUrl = `${req.protocol}://${req.host.replace('webstreamr', 'mediaflow-proxy')}`;
    }

    const manifest = buildManifest(this.sources, this.extractors, config);

    res.setHeader('content-type', 'text/html');
    res.send(landingTemplate(manifest));
  };
}
