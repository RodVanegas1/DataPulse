import { DatasetRepository } from '../repositories/dataset.repository';

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
    };
  }
}
