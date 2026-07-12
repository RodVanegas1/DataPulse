import { Router } from 'express';
import { validateQuery } from '../../../shared/middlewares/validate';
import { reportQuerySchema } from '../../reports/validators/report.validators';
import { ExportController } from '../controllers/export.controller';

const controller = new ExportController();

export const exportRouter = Router();

exportRouter.get('/formats', controller.formats);
exportRouter.get('/tourism-places', validateQuery(reportQuerySchema), controller.tourismPlaces);
