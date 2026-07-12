import { Router } from 'express';
import { LayerController } from '../controllers/layer.controller';

const controller = new LayerController();

export const layerRouter = Router();

layerRouter.get('/', controller.list);
layerRouter.get('/:slug', controller.detail);
layerRouter.get('/:slug/geojson', controller.geojson);
