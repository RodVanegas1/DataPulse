import { Router } from 'express';
import { GeographyController } from '../controllers/geography.controller';

const controller = new GeographyController();

export const geographyRouter = Router();

geographyRouter.get('/departments', controller.departments);
geographyRouter.get('/municipalities', controller.municipalities);
