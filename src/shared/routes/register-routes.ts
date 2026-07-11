import { Express, Router } from 'express';
import { config } from '../../config/env';
import { analyticsRouter } from '../../modules/analytics/routes/analytics.routes';
import { aiRouter } from '../../modules/ai/routes/ai.routes';
import { datasetRouter } from '../../modules/datasets/routes/dataset.routes';
import { geographyRouter } from '../../modules/geography/routes/geography.routes';
import { HealthController } from '../../modules/health/controllers/health.controller';
import { healthRouter } from '../../modules/health/routes/health.routes';
import { layerRouter } from '../../modules/layers/routes/layer.routes';
import { platformRouter } from '../../modules/platform/routes/platform.routes';
import { reportRouter } from '../../modules/reports/routes/report.routes';
import { searchRouter } from '../../modules/search/routes/search.routes';
import { tourismRouter } from '../../modules/tourism/routes/tourism.routes';

export function registerRoutes(app: Express) {
  const router = Router();
  const healthController = new HealthController();

  router.use('/health', healthRouter);
  router.use('/platform', platformRouter);
  router.use('/geography', geographyRouter);
  router.use('/tourism', tourismRouter);
  router.use('/layers', layerRouter);
  router.use('/search', searchRouter);
  router.use('/analytics', analyticsRouter);
  router.use('/reports', reportRouter);
  router.use('/datasets', datasetRouter);
  router.use('/ai', aiRouter);

  app.use(config.API_PREFIX, router);

  app.use('/health', healthRouter);
  app.get('/status', healthController.status);
  app.get('/metrics', healthController.metrics);
  app.get('/version', healthController.version);
  app.use('/platform', platformRouter);
}
