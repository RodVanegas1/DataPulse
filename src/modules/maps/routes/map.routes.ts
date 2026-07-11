import { Router } from 'express';
import { MapController } from '../controllers/map.controller';

const controller = new MapController();

export const mapRouter = Router();

mapRouter.get('/config', controller.config);
mapRouter.get('/heatmap', controller.heatmap);
