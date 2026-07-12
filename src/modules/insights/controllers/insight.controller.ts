import { RequestHandler } from 'express';
import { sendSuccess } from '../../../core/responses/api-response';
import { AnalyticsService } from '../../analytics/services/analytics.service';

export class InsightController {
  constructor(private readonly analyticsService = new AnalyticsService()) {}

  list: RequestHandler = async (_req, res, next) => {
    try {
      return sendSuccess(res, 'Territorial insights retrieved', await this.analyticsService.insights());
    } catch (error) {
      return next(error);
    }
  };
}
