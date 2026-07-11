import swaggerJSDoc from 'swagger-jsdoc';
import { config } from '../config/env';

export const openApiSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: config.APP_NAME,
      version: config.APP_VERSION,
      description: 'Public API for tourism, territorial intelligence, GIS layers, analytics, reports, datasets, and AI abstractions.',
    },
    servers: [{ url: config.API_PREFIX }],
    components: {
      schemas: {
        ApiEnvelope: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
            meta: { type: 'object' },
            pagination: { type: 'object', nullable: true },
          },
        },
      },
    },
  },
  apis: ['src/modules/**/*.ts'],
});
