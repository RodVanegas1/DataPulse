import { RequestHandler } from 'express';
import { sendSuccess } from '../../../core/responses/api-response';
import { GeographyService } from '../../geography/services/geography.service';
import { LayerService } from '../../layers/services/layer.service';
import { AnalyticsService } from '../../analytics/services/analytics.service';

export class MapController {
  constructor(
    private readonly geographyService = new GeographyService(),
    private readonly layerService = new LayerService(),
    private readonly analyticsService = new AnalyticsService(),
  ) {}

  config: RequestHandler = async (_req, res, next) => {
    try {
      const [departments, layers] = await Promise.all([this.geographyService.getDepartments(), this.layerService.listLayers(true)]);
      return sendSuccess(res, 'Map configuration retrieved', {
        center: { latitude: 13.7942, longitude: -88.8965 },
        zoom: 8,
        bounds: { north: 14.45, south: 13.15, east: -87.65, west: -90.15 },
        providers: ['OpenStreetMap', 'Leaflet', 'MapLibre'],
        capabilities: ['geojson', 'heatmap', 'density', 'clusters', 'satellite-ready', 'terrain-ready', '3d-ready'],
        administrativeDivisions: departments,
        layers,
      });
    } catch (error) {
      return next(error);
    }
  };

  heatmap: RequestHandler = async (_req, res, next) => {
    try {
      return sendSuccess(res, 'Map heatmap retrieved', await this.analyticsService.heatmap());
    } catch (error) {
      return next(error);
    }
  };
}
