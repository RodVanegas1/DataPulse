import { RequestHandler } from 'express';
import { sendSuccess } from '../../../core/responses/api-response';
import { PlatformService } from '../services/platform.service';

export class PlatformController {
  constructor(private readonly service = new PlatformService()) {}

  registry: RequestHandler = (_req, res) => {
    return sendSuccess(res, 'Platform registry', this.service.registry());
  };

  config: RequestHandler = (_req, res) => {
    return sendSuccess(res, 'Platform configuration', this.service.config());
  };
}
