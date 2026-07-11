import { RequestHandler } from 'express';
import { sendSuccess } from '../../../core/responses/api-response';
import { AnalyticsService } from '../services/analytics.service';

export class AnalyticsController {
  constructor(private readonly service = new AnalyticsService()) {}

  dashboard: RequestHandler = async (_req, res, next) => {
    try {
      const dashboard = await this.service.dashboard();
      return sendSuccess(res, 'Dashboard analytics retrieved', dashboard);
    } catch (error) {
      return next(error);
    }
  };
}
