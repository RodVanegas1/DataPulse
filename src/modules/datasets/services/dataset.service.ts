import { DatasetRepository } from '../repositories/dataset.repository';
import { NotFoundError, ValidationError } from '../../../core/errors/api-error';

export class DatasetService {
  constructor(private readonly repository = new DatasetRepository()) {}

  list() {
    return this.repository.list();
  }

  getImportCapabilities() {
    return {
      supportedFormats: ['CSV', 'EXCEL', 'JSON', 'GEOJSON', 'API'],
      pipeline: ['validate-source', 'normalize-schema', 'stage-records', 'review-quality', 'publish-dataset'],
      status: 'ready-for-provider-implementation',
      connectors: ['government-open-data', 'geojson', 'csv', 'tourism-api', 'weather-api', 'environmental-api', 'gis-service'],
    };
  }

  async export(slug: string, format: 'json' | 'geojson' | 'csv') {
    const dataset = await this.repository.getBySlug(slug);
    if (!dataset || !dataset.public) throw new NotFoundError('Dataset');

    const payload = {
      id: dataset.id,
      name: dataset.name,
      slug: dataset.slug,
      description: dataset.description,
      format: dataset.format,
      source: dataset.source,
      schema: dataset.schema,
      metadata: dataset.metadata,
      reports: dataset.reports.map((report) => ({ id: report.id, name: report.name, slug: report.slug, summary: report.summary })),
      exportedAt: new Date().toISOString(),
    };

    if (format === 'geojson') {
      return { type: 'FeatureCollection', features: [], metadata: payload };
    }

    if (format === 'csv') {
      return [
        'id,name,slug,format,source,description',
        [payload.id, payload.name, payload.slug, payload.format, payload.source ?? '', payload.description ?? ''].map(this.csvValue).join(','),
      ].join('\n');
    }

    return payload;
  }

  validateImport(input: { format: 'CSV' | 'EXCEL' | 'JSON' | 'GEOJSON'; payload?: unknown; source?: string }) {
    const errors: string[] = [];
    if (!input.payload && !input.source) errors.push('Either payload or source is required.');
    if (input.format === 'GEOJSON' && input.payload) {
      const payload = input.payload as { type?: string; features?: unknown };
      if (payload.type !== 'FeatureCollection') errors.push('GeoJSON payload must be a FeatureCollection.');
      if (!Array.isArray(payload.features)) errors.push('GeoJSON payload must include a features array.');
    }
    if (input.format === 'JSON' && input.payload && typeof input.payload !== 'object') {
      errors.push('JSON payload must be an object or array.');
    }
    if (errors.length) throw new ValidationError(errors);

    return {
      valid: true,
      detectedFormat: input.format,
      source: input.source ?? 'inline-payload',
      normalizedSchemaReady: true,
      stagingReady: true,
      warnings: input.format === 'EXCEL' ? ['Excel parsing is prepared at dependency level; upload transport can be added without changing business logic.'] : [],
    };
  }

  private csvValue(value: unknown) {
    const text = String(value ?? '').replace(/"/g, '""');
    return /[",\n]/.test(text) ? `"${text}"` : text;
  }
}
