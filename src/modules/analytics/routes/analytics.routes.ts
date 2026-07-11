import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';

const controller = new AnalyticsController();

export const analyticsRouter = Router();

analyticsRouter.get('/dashboard', controller.dashboard);
