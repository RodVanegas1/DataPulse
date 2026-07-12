import { Router } from 'express';
import { z } from 'zod';
import { validateBody, validateQuery } from '../../../shared/middlewares/validate';
import { DatasetController } from '../controllers/dataset.controller';

const controller = new DatasetController();

export const datasetRouter = Router();

const exportQuerySchema = z.object({ format: z.enum(['json', 'geojson', 'csv']).default('json') });
const importValidationSchema = z.object({
  format: z.enum(['CSV', 'EXCEL', 'JSON', 'GEOJSON']),
  payload: z.unknown().optional(),
  source: z.string().optional(),
});

datasetRouter.get('/', controller.list);
datasetRouter.get('/import-capabilities', controller.capabilities);
datasetRouter.post('/validate-import', validateBody(importValidationSchema), controller.validateImport);
datasetRouter.get('/:slug/export', validateQuery(exportQuerySchema), controller.export);
