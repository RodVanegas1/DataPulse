import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env';
import { openApiSpec } from './docs/openapi';
import { errorHandler } from './shared/middlewares/error-handler';
import { notFoundHandler } from './shared/middlewares/not-found';
import {
  compressionMiddleware,
  corsMiddleware,
  helmetMiddleware,
  rateLimitMiddleware,
} from './shared/middlewares/security';
import { registerRoutes } from './shared/routes/register-routes';

export function createApp() {
  const app = express();

  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  app.use(compressionMiddleware);
  app.use(rateLimitMiddleware);
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('combined'));

  app.use(`${config.API_PREFIX}/docs`, swaggerUi.serve, swaggerUi.setup(openApiSpec));
  registerRoutes(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
