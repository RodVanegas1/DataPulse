import { config } from './config/env';
import { createApp } from './app';
import { prisma } from './shared/database/prisma';
import { logger } from './shared/logger/logger';

const app = createApp();

const server = app.listen(config.PORT, () => {
  logger.info(`${config.APP_NAME} listening`, {
    port: config.PORT,
    environment: config.NODE_ENV,
    prefix: config.API_PREFIX,
  });
});

const shutdown = async () => {
  logger.info('Shutting down API server');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
