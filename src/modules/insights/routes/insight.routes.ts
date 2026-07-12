import { Router } from 'express';
import { InsightController } from '../controllers/insight.controller';

const controller = new InsightController();

export const insightRouter = Router();

insightRouter.get('/', controller.list);
