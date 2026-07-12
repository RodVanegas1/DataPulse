import { RequestHandler } from 'express';
import { sendSuccess } from '../../../core/responses/api-response';
import { HealthService } from '../services/health.service';

export class HealthController {
  constructor(private readonly service = new HealthService()) {}

  health: RequestHandler = async (_req, res) => {
    const health = await this.service.health();
    return sendSuccess(res, 'Platform health', health);
  };

  status: RequestHandler = async (_req, res) => {
    const status = await this.service.status();
    return sendSuccess(res, 'Platform status', status);
  };

  metrics: RequestHandler = async (_req, res) => {
    const metrics = await this.service.metrics();
    return sendSuccess(res, 'Platform metrics', metrics);
  };

  version: RequestHandler = (_req, res) => {
    return sendSuccess(res, 'Platform version', this.service.version());
  };
}
