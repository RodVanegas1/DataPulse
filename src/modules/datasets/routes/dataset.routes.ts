import { Router } from 'express';
import { DatasetController } from '../controllers/dataset.controller';

const controller = new DatasetController();

export const datasetRouter = Router();

datasetRouter.get('/', controller.list);
datasetRouter.get('/import-capabilities', controller.capabilities);
