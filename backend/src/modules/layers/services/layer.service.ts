import { NotFoundError } from '../../../core/errors/api-error';
import { LayerRepository } from '../repositories/layer.repository';

export class LayerService {
  constructor(private readonly repository = new LayerRepository()) {}

  listLayers(enabled?: boolean) {
    return this.repository.listLayers(enabled);
  }

  async getLayer(slug: string) {
    const layer = await this.repository.getLayer(slug);
    if (!layer) throw new NotFoundError('Layer');
    return layer;
  }

  async getGeoJson(slug: string) {
    const layer = await this.getLayer(slug);
    return (
      layer.geojson ?? {
        type: 'FeatureCollection',
        features: [],
        metadata: {
          layer: layer.slug,
          source: layer.source,
          compatibleWith: ['Mapbox', 'Leaflet', 'Google Maps'],
        },
      }
    );
  }
}
