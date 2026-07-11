import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';

const controller = new AnalyticsController();

export const analyticsRouter = Router();

analyticsRouter.get('/dashboard', controller.dashboard);
analyticsRouter.get('/indicators', controller.indicators);
analyticsRouter.get('/heatmap', controller.heatmap);
analyticsRouter.get('/insights', controller.insights);
