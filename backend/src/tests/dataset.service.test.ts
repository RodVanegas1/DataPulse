import { describe, expect, it } from 'vitest';
import { ValidationError } from '../core/errors/api-error';
import { DatasetService } from '../modules/datasets/services/dataset.service';

describe('DatasetService', () => {
  const service = new DatasetService();

  it('validates GeoJSON import payloads', () => {
    const result = service.validateImport({
      format: 'GEOJSON',
      payload: { type: 'FeatureCollection', features: [] },
    });

    expect(result.valid).toBe(true);
    expect(result.stagingReady).toBe(true);
  });

  it('rejects invalid import payloads', () => {
    expect(() => service.validateImport({ format: 'JSON' })).toThrow(ValidationError);
  });
});
