import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

const controller = new DashboardController();

export const dashboardRouter = Router();

dashboardRouter.get('/overview', controller.overview);
