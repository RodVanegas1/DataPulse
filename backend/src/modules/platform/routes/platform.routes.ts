import { Router } from 'express';
import { PlatformController } from '../controllers/platform.controller';

const controller = new PlatformController();

export const platformRouter = Router();

/**
 * @openapi
 * /platform:
 *   get:
 *     summary: Platform registry and enabled capabilities.
 *     responses:
 *       200:
 *         description: Platform registry.
 */
platformRouter.get('/', controller.registry);
platformRouter.get('/config', controller.config);
