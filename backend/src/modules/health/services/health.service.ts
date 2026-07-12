import { config } from '../../../config/env';
import { DEFAULT_REPORT_FORMATS, SUPPORTED_LANGUAGES } from '../../../core/constants/platform';
import { prisma } from '../../../shared/database/prisma';

const startedAt = new Date();

export class HealthService {
  async health() {
    const database = await this.databaseStatus();
    return {
      status: database.connected ? 'operational' : 'degraded',
      app: config.APP_NAME,
      version: config.APP_VERSION,
      environment: config.NODE_ENV,
      uptime: process.uptime(),
      startedAt: startedAt.toISOString(),
      timestamp: new Date().toISOString(),
      database,
      api: { available: true, prefix: config.API_PREFIX },
      modules: ['health', 'platform', 'geography', 'tourism', 'layers', 'search', 'analytics', 'reports', 'datasets', 'ai'],
    };
  }

  async status() {
    const health = await this.health();
    return {
      status: health.status,
      database: health.database.connected ? 'connected' : 'unavailable',
      api: 'available',
      environment: health.environment,
      timestamp: health.timestamp,
    };
  }

  async metrics() {
    const database = await this.databaseStatus();
    const memory = process.memoryUsage();
    return {
      uptime: process.uptime(),
      memory,
      database,
      modulesLoaded: 10,
      supportedLanguages: SUPPORTED_LANGUAGES,
      supportedExportFormats: DEFAULT_REPORT_FORMATS,
    };
  }

  version() {
    return {
      app: config.APP_NAME,
      version: config.APP_VERSION,
      node: process.version,
      environment: config.NODE_ENV,
    };
  }

  private async databaseStatus() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { connected: true, provider: 'postgresql' };
    } catch (error) {
      return {
        connected: false,
        provider: 'postgresql',
        error: error instanceof Error ? error.message : 'Unknown database error',
      };
    }
  }
}
