import { Request, Response, Router } from 'express';
import { landingTemplate } from '../landingTemplate';
import { buildManifest, getDefaultConfig } from '../utils';
import { Handler } from '../handler';
import { Config } from '../types';

export class ConfigureController {
  public readonly router: Router;

  private readonly handlers: Handler[];

  constructor(handlers: Handler[]) {
    this.router = Router();

    this.handlers = handlers;

    this.router.get('/configure', this.getConfigure.bind(this));
    this.router.get('/:config/configure', this.getConfigure.bind(this));
  }

  private readonly getConfigure = (req: Request, res: Response) => {
    const config: Config = JSON.parse(req.params['config'] || JSON.stringify(getDefaultConfig()));

    const manifest = buildManifest(this.handlers, config);

    res.setHeader('content-type', 'text/html');
    res.send(landingTemplate(manifest));
  };
}
