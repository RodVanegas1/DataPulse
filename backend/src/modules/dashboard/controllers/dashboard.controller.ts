import { RequestHandler } from 'express';
import { sendSuccess } from '../../../core/responses/api-response';
import { AnalyticsService } from '../../analytics/services/analytics.service';

export class DashboardController {
  constructor(private readonly analyticsService = new AnalyticsService()) {}

  overview: RequestHandler = async (_req, res, next) => {
    try {
      const dashboard = await this.analyticsService.dashboard();
      return sendSuccess(res, 'Dashboard overview retrieved', {
        cards: dashboard.kpis,
        charts: dashboard.rankings,
        mapSummary: {
          enabledLayers: dashboard.kpis.enabledLayers,
          featuredPlaces: dashboard.kpis.featuredPlaces,
          upcomingEvents: dashboard.kpis.upcomingEvents,
        },
        recentDatasets: dashboard.recentDatasets,
        recentReports: dashboard.recentReports,
        latestAnalytics: dashboard.insights,
      });
    } catch (error) {
      return next(error);
    }
  };
}
