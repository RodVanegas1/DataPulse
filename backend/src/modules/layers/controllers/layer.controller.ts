import { RequestHandler } from 'express';
import { sendSuccess } from '../../../core/responses/api-response';
import { LayerService } from '../services/layer.service';

export class LayerController {
  constructor(private readonly service = new LayerService()) {}

  list: RequestHandler = async (req, res, next) => {
    try {
      const enabled = req.query.enabled === undefined ? undefined : req.query.enabled === 'true';
      const layers = await this.service.listLayers(enabled);
      return sendSuccess(res, 'Layers retrieved', layers);
    } catch (error) {
      return next(error);
    }
  };

  detail: RequestHandler = async (req, res, next) => {
    try {
      const layer = await this.service.getLayer(req.params.slug);
      return sendSuccess(res, 'Layer retrieved', layer);
    } catch (error) {
      return next(error);
    }
  };

  geojson: RequestHandler = async (req, res, next) => {
    try {
      const geojson = await this.service.getGeoJson(req.params.slug);
      return sendSuccess(res, 'Layer GeoJSON retrieved', geojson);
    } catch (error) {
      return next(error);
    }
  };
}
