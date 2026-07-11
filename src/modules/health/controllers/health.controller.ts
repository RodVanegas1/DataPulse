import { RequestHandler } from 'express';
import { config } from '../../../config/env';
import { sendSuccess } from '../../../core/responses/api-response';

export class HealthController {
  status: RequestHandler = (_req, res) => {
    return sendSuccess(res, 'Platform is operational', {
      app: config.APP_NAME,
      version: config.APP_VERSION,
      environment: config.NODE_ENV,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  };
}
