import { Prisma } from '@prisma/client';
import { config } from '../../../config/env';
import { DEFAULT_REPORT_FORMATS, PUBLIC_API_VERSION, SUPPORTED_LANGUAGES } from '../../../core/constants/platform';

const MODULES = [
  'geography',
  'tourism',
  'layers',
  'search',
  'analytics',
  'reports',
  'datasets',
  'ai',
  'platform',
] as const;

const ENGINES = [
  'search',
  'dashboard',
  'analytics',
  'insights',
  'map',
  'dataset',
  'export',
  'report',
  'ai-gateway',
] as const;

export class PlatformService {
  registry() {
    return {
      name: config.APP_NAME,
      version: config.APP_VERSION,
      databaseProvider: 'postgresql',
      environment: config.NODE_ENV,
      runningModules: MODULES,
      enabledEngines: ENGINES,
      supportedLanguages: SUPPORTED_LANGUAGES,
      supportedExportFormats: DEFAULT_REPORT_FORMATS,
      build: {
        node: process.version,
        prismaClient: Prisma.prismaVersion.client,
        apiVersion: PUBLIC_API_VERSION,
      },
    };
  }

  config() {
    return {
      apiVersion: PUBLIC_API_VERSION,
      supportedLanguages: SUPPORTED_LANGUAGES.map((code) => ({
        code,
        dateFormat: code === 'en' ? 'MM/dd/yyyy' : 'dd/MM/yyyy',
        numberFormat: code === 'en' ? 'en-US' : `${code}-SV`,
        currency: 'USD',
        timezone: 'America/El_Salvador',
      })),
      frontend: {
        apiPrefix: config.API_PREFIX,
        publicReadAccess: true,
        writeProtection: config.API_KEY ? 'api-key' : 'disabled',
      },
      map: {
        defaultCenter: { latitude: 13.7942, longitude: -88.8965 },
        defaultZoom: 8,
        bounds: {
          north: 14.45,
          south: 13.15,
          east: -87.65,
          west: -90.15,
        },
        providers: ['Mapbox', 'Leaflet', 'Google Maps'],
        capabilities: ['markers', 'layers', 'geojson', 'clusters', 'heatmaps', 'routes', '3d-ready', 'satellite-ready'],
      },
      availableLayers: ['tourism', 'hotels', 'restaurants', 'culture', 'nature', 'transport', 'security', 'economy', 'climate', 'events'],
      exportFormats: DEFAULT_REPORT_FORMATS,
      features: {
        globalSearch: true,
        dashboard: true,
        analytics: true,
        insights: true,
        reports: true,
        datasets: true,
        aiGateway: true,
        authentication: false,
      },
      i18n: {
        translationNamespaces: ['common', 'geography', 'tourism', 'analytics', 'reports', 'maps'],
        fallbackLanguage: 'es',
      },
    };
  }
}
