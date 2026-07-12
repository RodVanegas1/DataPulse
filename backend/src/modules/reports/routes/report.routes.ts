import { Router } from 'express';
import { validateQuery } from '../../../shared/middlewares/validate';
import { ReportController } from '../controllers/report.controller';
import { reportQuerySchema } from '../validators/report.validators';

const controller = new ReportController();

export const reportRouter = Router();

reportRouter.get('/tourism-places', validateQuery(reportQuerySchema), controller.tourismPlaces);
