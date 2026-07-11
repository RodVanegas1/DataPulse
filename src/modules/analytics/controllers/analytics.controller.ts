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

  indicators: RequestHandler = async (_req, res, next) => {
    try {
      const indicators = await this.service.indicators();
      return sendSuccess(res, 'Analytics indicators retrieved', indicators);
    } catch (error) {
      return next(error);
    }
  };

  heatmap: RequestHandler = async (_req, res, next) => {
    try {
      const heatmap = await this.service.heatmap();
      return sendSuccess(res, 'Analytics heatmap retrieved', heatmap);
    } catch (error) {
      return next(error);
    }
  };

  insights: RequestHandler = async (_req, res, next) => {
    try {
      const insights = await this.service.insights();
      return sendSuccess(res, 'Territorial insights retrieved', insights);
    } catch (error) {
      return next(error);
    }
  };
}
