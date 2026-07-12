import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';

const controller = new HealthController();

export const healthRouter = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Public platform health status.
 *     responses:
 *       200:
 *         description: Platform status.
 */
healthRouter.get('/', controller.health);
healthRouter.get('/status', controller.status);
healthRouter.get('/metrics', controller.metrics);
healthRouter.get('/version', controller.version);
